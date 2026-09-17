// SPDX-License-Identifier: MIT-0
export function numberValue(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
export function readingState(row, now = Date.now()) {
  if (!row.record) return { label: 'Unavailable', tone: 'bad' };
  if (row.error || row.retained) return { label: 'Collection failed · earlier reading retained', tone: 'warn' };
  if (row.record.offline === true) return { label: 'Source reports device offline', tone: 'warn' };
  const measured = Date.parse(row.record.timestamp), collected = Date.parse(row.fetchedAt);
  if (!Number.isFinite(measured) || !Number.isFinite(collected)) return { label: 'Timestamp unavailable', tone: 'warn' };
  if (measured > now + 300000 || collected > now + 300000) return { label: 'Timestamp is in the future', tone: 'warn' };
  if (now - collected > 45 * 60000) return { label: 'Collection is older than 45 minutes', tone: 'warn' };
  if (now - measured > 20 * 60000) return { label: 'Stale measurement · over 20 minutes old', tone: 'warn' };
  return { label: 'Within demo freshness thresholds', tone: '' };
}
export function displayNumber(value) {
  const numeric = numberValue(value);
  return numeric === null ? '—' : numeric.toLocaleString(undefined, {maximumFractionDigits: 1});
}
export function validSnapshot(value) {
  return value?.schemaVersion === 1 && Number.isFinite(Date.parse(value.generatedAt)) &&
    Array.isArray(value.devices) && value.devices.length === 5 &&
    new Set(value.devices.map(row => row?.id)).size === value.devices.length &&
    value.devices.every(row => Number.isSafeInteger(row?.id) && row.id > 0 &&
      (row.record === null || (typeof row.record === 'object' && !Array.isArray(row.record) && row.record.locationId === row.id)));
}

const FIELDS={no2:['NO₂ (API reported)','ppb'],o3:['O₃ (API reported)','ppb'],no2WorkingElectrode:['NO₂ working electrode','mV'],no2AuxiliaryElectrode:['NO₂ auxiliary electrode','mV'],o3WorkingElectrode:['O₃ working electrode','mV'],o3AuxiliaryElectrode:['O₃ auxiliary electrode','mV'],afeTemp:['Analog front-end temperature',''],heatindex:['Heat index','°C'],pm02:['PM₂.₅','µg/m³'],pm01:['PM₁','µg/m³'],pm10:['PM₁₀','µg/m³'],pm02_corrected:['PM₂.₅ corrected','µg/m³'],pm01_corrected:['PM₁ corrected','µg/m³'],pm10_corrected:['PM₁₀ corrected','µg/m³'],atmp:['Temperature','°C'],atmp_corrected:['Temperature corrected','°C'],rhum:['Relative humidity','%'],rhum_corrected:['Humidity corrected','%'],rco2:['CO₂','ppm'],rco2_corrected:['CO₂ corrected','ppm'],tvoc:['TVOC (API reported)','ppb'],tvocIndex:['VOC index / firmware value',''],noxIndex:['NOx index / firmware value',''],tvocRaw:['VOC raw signal',''],noxRaw:['NOx raw signal',''],pm003Count:['Particles >0.3 µm','per 0.1 L'],batteryVoltage:['Battery','V'],panelVoltage:['Solar panel','V'],wifi:['Signal strength','dBm'],pres:['Pressure','hPa']};
const META=new Set(['locationId','placeId','latitude','longitude','lat','lng','offline','datapoints','timestamp','model','firmwareVersion','serialno','locationName','publicLocationName','locationType','timezone','publicPlaceName','publicPlaceUrl','publicContributorName']);
const PARAMETER_LEGEND='N/A: unsupported by model · N/D: expected or returned field, no data · —: not reported; support unknown';
const PRIMARY_PARAMETERS=['pm02','pm10','pm01','pm003Count','rco2','no2','o3','atmp','rhum','pres'];
export function parameterRows(record,modelCode){
 const r=record||{},known=['O-M-1PPSTON-CE','O-M-1PPST-CE','O-1PST','O-1PS'].includes(modelCode);
 const gas=modelCode==='O-M-1PPSTON-CE';
 const keys=[...new Set([...PRIMARY_PARAMETERS,...Object.keys(r).filter(k=>!META.has(k))])];
 return keys.map(key=>{
  const field=FIELDS[key],label=key==='pm02'?'PM₂.₅ (raw)':field?.[0]||key,unit=field?.[1]||'',v=r[key];
  const present=Object.prototype.hasOwnProperty.call(r,key);
  const numericValue=(typeof v==='number'||(typeof v==='string'&&v.trim()!==''))&&Number.isFinite(Number(v));
  if(numericValue){const value=Number(v),negative=['no2','o3'].includes(key)&&value<0;return {key,label,text:value.toLocaleString(undefined,{maximumFractionDigits:6})+(unit?' '+unit:(!field||['afeTemp','tvocRaw','noxRaw'].includes(key)?' (unit unspecified)':'')),status:negative?'warning':'value',reason:negative?'Negative gas value reported by API; not a valid physical concentration. Check source/calibration.':''};}
  if(!field&&v!==null&&v!==undefined&&v!=='')return {key,label,text:typeof v==='object'?JSON.stringify(v):String(v),status:'value',reason:'Unit unspecified'};
  if(known&&!gas&&['no2','o3'].includes(key))return {key,label,text:'N/A',status:'unsupported',reason:'This model has no dedicated NO₂/O₃ sensors'};
  const expected=known&&(['pm02','pm10','pm01','pm003Count','atmp','rhum'].includes(key)||(gas&&['no2','o3'].includes(key)));
  if(present||expected)return {key,label,text:'N/D',status:'no-data',reason:present?'API field returned without a usable reading':'Expected for this model, but no reading in this response'};
  return {key,label,text:'—',status:'unknown',reason:'Not reported in this response; model support has not been established'};
 });
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const units=Object.fromEntries(Object.entries(FIELDS).map(([k,v])=>[k,v[1]]));
  const labels=Object.fromEntries(Object.entries(FIELDS).map(([k,v])=>[k,v[0]]));
  let snapshot = null, busy = false, map = null, markers = null;
  const utc = value => {const n=Date.parse(value);return Number.isFinite(n)?new Date(n).toISOString().replace('T',' ').replace(/\.\d{3}Z$/, ' UTC'):'Unavailable';};
  function element(tag, text, className) {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  function link(label, href) {const el=element('a',label);el.href=href;el.target='_blank';el.rel='noopener noreferrer';return el;}
  function compactParameters(record,modelCode){
    const container=element('div'),list=element('div',undefined,'parameter-values');list.setAttribute('aria-label','Parameters and values');
    for(const row of parameterRows(record,modelCode)){
      const item=element('div',undefined,'parameter-row '+row.status);item.dataset.field=row.key;item.title=row.reason;
      item.append(element('span',row.label),element('span',row.text+(row.status==='warning'?' ⚠':'')));list.append(item);
    }
    container.append(list,element('p',PARAMETER_LEGEND,'parameter-legend'));
    if(parameterRows(record,modelCode).some(row=>row.status==='warning'))container.append(element('p','⚠ Negative gas value from API; check source/calibration.','small gas-warning'));
    return container;
  }
  function render() {
    const now=Date.now(), gap=now-Date.parse(snapshot.generatedAt);
    const successful=snapshot.devices.filter(row=>!row.error).length;
    $('publication').textContent=`Last collection attempt: ${utc(snapshot.generatedAt)} · ${successful}/${snapshot.devices.length} succeeded` +
      (gap>45*60000?' · Collection is overdue; readings may be old.':'') + (gap < -300000?' · Collection timestamp is in the future.':'');
    const open=new Set([...$('details').querySelectorAll('details[open]')].map(d=>d.id));
    $('cards').replaceChildren();$('details').replaceChildren();
    for (const row of snapshot.devices) {
      const r=row.record, name=r?.locationName||row.name||`Location ${row.id}`, state=readingState(row,now);
      const card=element('article',undefined,'card');
      card.append(element('div',row.country,'country'),element('h3',name),element('div',`#${row.id} · ${r?.model||row.model}`,'small'));
      const pm=element('div',displayNumber(r?.pm02),'pm');pm.append(element('span',' µg/m³','unit'));
      card.append(pm,element('p','Raw PM₂.₅ · published snapshot','small'),element('span',state.label,'status '+state.tone));
      card.append(compactParameters(r,r?.model||row.model));
      card.append(element('p','Measured: '+utc(r?.timestamp),'small'),element('p','Collected: '+utc(row.fetchedAt),'small'));
      card.append(element('p','Contributor: '+(r?.publicContributorName||'Not supplied'),'small'));
      if(row.error)card.append(element('p',row.error,'small'));
      const detailLink=element('a','View all returned fields ↓');detailLink.href='#device-'+row.id;
      detailLink.onclick=()=>{const d=$('device-'+row.id);if(d)d.open=true;};card.append(detailLink);$('cards').append(card);
      const details=element('details');details.id='device-'+row.id;details.open=open.has(details.id);
      details.append(element('summary',name+' · #'+row.id));
      details.append(element('p',state.label+'. Measured: '+utc(r?.timestamp)+'. Collected: '+utc(row.fetchedAt)+'.','small'));
      if(r) {
        const table=element('table'),caption=element('caption','API fields for '+name);table.append(caption);
        for(const [key,value] of Object.entries(r)) {
          const tr=element('tr'),th=element('th',labels[key]||key);th.scope='row';
          let text=value===null?'Unavailable':typeof value==='object'?JSON.stringify(value):String(value);
          if(value!==null && units[key])text+=' '+units[key];
          else if(typeof value==='number' && !['locationId','placeId','latitude','longitude'].includes(key))text+=' (units not specified here)';
          tr.append(th,element('td',text));table.append(tr);
        }
        details.append(table,element('h3','Original public API record'),element('pre',JSON.stringify(r,null,2)));
      } else details.append(element('p','No reading available. Use the main app to request data directly.'));
      details.append(link('Current AirGradient JSON (may be newer) ↗',`https://api.airgradient.com/public/api/v1/world/locations/${row.id}/measures/current`));
      $('details').append(details);
    }
    renderMarkers();
  }
  function configurePopup(popup){popup.options.maxHeight=Math.max(120,Math.min(350,map.getSize().y-80));popup.options.maxWidth=Math.min(330,map.getSize().x-110);popup.options.autoPanPaddingTopLeft=L.point(42,12);popup.options.autoPanPaddingBottomRight=L.point(12,12);}
  function renderMarkers() {
    if(!map||!snapshot)return;
    markers.clearLayers();const positions=[];
    for(const row of snapshot.devices) {
      const r=row.record, live=numberValue(r?.latitude)!==null&&numberValue(r?.longitude)!==null;
      const lat=live?r.latitude:row.latitude,lon=live?r.longitude:row.longitude;
      if(numberValue(lat)===null||numberValue(lon)===null||Math.abs(lat)>90||Math.abs(lon)>180)continue;
      const state=readingState(row),popup=element('div');
      popup.append(element('strong',r?.locationName||row.name),element('p',displayNumber(r?.pm02)+' µg/m³ · raw PM₂.₅','popup-headline'),element('p','Parameters · scroll for the full list','parameter-hint'),compactParameters(r,r?.model||row.model),element('p',state.label,'small'),element('p','Measured: '+utc(r?.timestamp),'small'),element('p','Collected: '+utc(row.fetchedAt),'small'),element('p',live?'API coordinates':'Reference coordinates; current coordinates unavailable','small'));
      const icon=L.divIcon({className:'marker'+(state.tone?' stale':''),html:displayNumber(r?.pm02),iconSize:[42,42],iconAnchor:[21,21]});
      L.marker([lat,lon],{icon}).bindPopup(layer=>{configurePopup(layer.getPopup());return popup;},{maxWidth:330,maxHeight:350}).addTo(markers);positions.push([lat,lon]);
    }
    if(positions.length)map.fitBounds(positions,{padding:[50,50],maxZoom:4});
  }
  async function fetchJson(path) {
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try {const response=await fetch(path,{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);return await response.json();}
    finally {clearTimeout(timer);}
  }
  async function reload() {
    if(busy)return;busy=true;$('reload').disabled=true;
    try {
      const data=await fetchJson('./data/latest.json?reload='+Date.now());
      if(!validSnapshot(data))throw Error('Unexpected snapshot format');
      snapshot=data;render();$('error').hidden=true;
    } catch(error) {
      $('error').textContent='Could not load published data. '+(snapshot?'Earlier displayed data is retained; check its timestamps. ':'')+'Check your internet connection or use the main Python app.';
      $('error').hidden=false;
      if(snapshot)render();else $('publication').textContent='Published readings unavailable.';
    } finally {busy=false;$('reload').disabled=false;}
  }
  async function initMap() {
    if(!window.L){$('map-status').textContent='Map library unavailable. All readings remain accessible in cards and tables.';$('map').hidden=true;return;}
    map=L.map('map',{scrollWheelZoom:false,fadeAnimation:false}).setView([15,60],2);markers=L.layerGroup().addTo(map);
    map.on('resize',()=>map.closePopup());
    try {const land=await fetchJson('./data/world.json');L.geoJSON(land,{style:{color:'#a1b7b8',weight:0.6,fillColor:'#f4f4e9',fillOpacity:1},interactive:false}).addTo(map);map.attributionControl.addAttribution('Natural Earth (public domain)');$('map-status').textContent='Natural Earth world outline. Use map controls or pinch to zoom. Measurements can be older than collection time.';}
    catch{$('map-status').textContent='World outline unavailable. Device coordinates and readings are still shown.';}
    renderMarkers();
  }
  $('reload').onclick=reload;
  reload();initMap();setInterval(()=>{if(!document.hidden)reload();},5*60000);
}
