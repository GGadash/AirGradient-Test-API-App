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
    Array.isArray(value.devices) && value.devices.length === 4 &&
    value.devices.every(row => Number.isSafeInteger(row?.id) && row.id > 0 &&
      (row.record === null || (typeof row.record === 'object' && !Array.isArray(row.record) && row.record.locationId === row.id)));
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const units = {pm01:'µg/m³',pm02:'µg/m³',pm10:'µg/m³',rco2:'ppm',atmp:'°C',rhum:'%',wifi:'dBm',heatindex:'°C',tvocIndex:'index',noxIndex:'index'};
  const labels = {pm01:'PM₁',pm02:'PM₂.₅ (raw)',pm10:'PM₁₀',rco2:'CO₂',atmp:'Temperature',rhum:'Relative humidity',wifi:'Wi-Fi signal',heatindex:'Heat index',tvocIndex:'VOC index / firmware value',noxIndex:'NOx index / firmware value'};
  let snapshot = null, busy = false, map = null, markers = null;
  const utc = value => {const n=Date.parse(value);return Number.isFinite(n)?new Date(n).toISOString().replace('T',' ').replace(/\.\d{3}Z$/, ' UTC'):'Unavailable';};
  function element(tag, text, className) {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  function link(label, href) {const el=element('a',label);el.href=href;el.target='_blank';el.rel='noopener noreferrer';return el;}
  function render() {
    const now=Date.now(), gap=now-Date.parse(snapshot.generatedAt);
    const successful=snapshot.devices.filter(row=>!row.error).length;
    $('publication').textContent=`Last collection attempt: ${utc(snapshot.generatedAt)} · ${successful}/4 succeeded` +
      (gap>45*60000?' · Collection is overdue; readings may be old.':'') + (gap < -300000?' · Collection timestamp is in the future.':'');
    const open=new Set([...$('details').querySelectorAll('details[open]')].map(d=>d.id));
    $('cards').replaceChildren();$('details').replaceChildren();
    for (const row of snapshot.devices) {
      const r=row.record, name=r?.locationName||row.name||`Location ${row.id}`, state=readingState(row,now);
      const card=element('article',undefined,'card');
      card.append(element('div',row.country,'country'),element('h3',name),element('div',`#${row.id} · ${r?.model||row.model}`,'small'));
      const pm=element('div',displayNumber(r?.pm02),'pm');pm.append(element('span',' µg/m³','unit'));
      card.append(pm,element('p','Raw PM₂.₅ · published snapshot','small'),element('span',state.label,'status '+state.tone));
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
  function renderMarkers() {
    if(!map||!snapshot)return;
    markers.clearLayers();const positions=[];
    for(const row of snapshot.devices) {
      const r=row.record, live=numberValue(r?.latitude)!==null&&numberValue(r?.longitude)!==null;
      const lat=live?r.latitude:row.latitude,lon=live?r.longitude:row.longitude;
      if(numberValue(lat)===null||numberValue(lon)===null||Math.abs(lat)>90||Math.abs(lon)>180)continue;
      const state=readingState(row),popup=element('div');popup.append(element('strong',r?.locationName||row.name),element('p',displayNumber(r?.pm02)+' µg/m³ · raw PM₂.₅'),element('p',state.label),element('p',live?'API coordinates':'Reference coordinates; current coordinates unavailable'));
      const icon=L.divIcon({className:'marker'+(state.tone?' stale':''),html:displayNumber(r?.pm02),iconSize:[42,42],iconAnchor:[21,21]});
      L.marker([lat,lon],{icon}).bindPopup(popup).addTo(markers);positions.push([lat,lon]);
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
    map=L.map('map',{scrollWheelZoom:false}).setView([15,60],2);markers=L.layerGroup().addTo(map);
    try {const land=await fetchJson('./data/world.json');L.geoJSON(land,{style:{color:'#a1b7b8',weight:0.6,fillColor:'#f4f4e9',fillOpacity:1},interactive:false}).addTo(map);map.attributionControl.addAttribution('Natural Earth (public domain)');$('map-status').textContent='Natural Earth world outline. Use map controls or pinch to zoom. Measurements can be older than collection time.';}
    catch{$('map-status').textContent='World outline unavailable. Device coordinates and readings are still shown.';}
    renderMarkers();
  }
  $('reload').onclick=reload;
  reload();initMap();setInterval(()=>{if(!document.hidden)reload();},5*60000);
}
