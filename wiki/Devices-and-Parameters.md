# Air Quality Data: locations and parameters

Defaults in both editions, starting with v2.3.0-rc.1:

| Slot | Location | ID | Country | Model |
| --- | --- | --- | --- | --- |
| 1 | ESYair Pro | [196780](https://api.airgradient.com/public/api/v1/world/locations/196780/measures/current) | Switzerland | O-M-1PPSTON-CE |
| 2 | Sir Apollo Kagwa Road | [172350](https://api.airgradient.com/public/api/v1/world/locations/172350/measures/current) | Uganda | O-M-1PPSTON-CE |
| 3 | BANTHI, LAMPHUN | [189546](https://api.airgradient.com/public/api/v1/world/locations/189546/measures/current) | Thailand | O-M-1PPST-CE |
| 4 | Sri Jayawardenepura Kotte | [189917](https://api.airgradient.com/public/api/v1/world/locations/189917/measures/current) | Sri Lanka | O-1PST |
| 5 | Siththimaavaa Hingun | [76611](https://api.airgradient.com/public/api/v1/world/locations/76611/measures/current) | Maldives | O-1PS |

Names, coordinates, contributors, availability and fields can change upstream.
The first two models have dedicated gas hardware; their individual public-current
responses now expose NO2/O3. The other three do not have those dedicated sensors.
Main-app settings can replace slot 3 with another verified Max without gas sensors.
Upgrades migrate existing saved settings on the same browser origin, prepend
ESYair without duplication and retain custom devices. Restore five defaults in
Settings to recover this exact list.

## Parameter reference

| Fields | Meaning and units |
| --- | --- |
| `pm01`, `pm02`, `pm10` and corrected variants | PM1, PM2.5, PM10 in micrograms/m3 |
| `pm003Count` | Particle count per 0.1 litre |
| `rco2`, `rco2_corrected` | CO2, ppm |
| `atmp`, `atmp_corrected`, `heatindex` | Temperature / heat index, degrees Celsius |
| `rhum`, `rhum_corrected` | Relative humidity, % |
| `no2`, `o3` | API-reported nitrogen dioxide / ozone concentrations, **ppb** |
| `tvoc` | API-reported TVOC, ppb |
| `tvocIndex`, `noxIndex` | VOC / NOx index or firmware value, not NO2/O3 concentration |
| `tvocRaw`, `noxRaw` | Raw signals; units unspecified here |
| `no2WorkingElectrode`, `no2AuxiliaryElectrode`, `o3WorkingElectrode`, `o3AuxiliaryElectrode` | Raw electrode signals, **mV**, not concentrations |
| `afeTemp` | Analog front-end temperature; unit unspecified in API schema |
| `batteryVoltage`, `panelVoltage` | Battery / solar-panel voltage, V |
| `wifi`, `pres` | Signal strength, dBm / pressure, hPa, where supplied |
| Timestamp, coordinates, model, firmware, contributor and other metadata | Original API record details |

Actual fields vary by model and endpoint. All returned fields remain inspectable;
unknown fields keep their original names and unspecified units. Parameter counts
reflect each response rather than a fixed total. Public world-current responses
may omit raw electrodes; an authorized current endpoint can expose them. Optional
hourly buckets require a token authorized for those locations; availability varies.
See the [AirGradient API specification](https://api.airgradient.com/public/docs/api/v1/).

## Reading gas values

Cards and details show NO2 and O3 in ppb. The main map selector can display either
field. The app displays AirGradient's concentration fields, without deriving them
from electrode voltages. Negative values are preserved and flagged as physically
invalid concentrations; zero and positive numbers alone do not prove accuracy.
Missing/null values stay unavailable. NOx index is never relabelled as NO2.

Check measurement time separately from collection time. Stale readings, offline
status or collection failures can affect interpretation. The app does not certify
calibration or accuracy. **Testing and demo only; mistakes may be present.**

[Credits and licensing](https://github.com/GGadash/AirGradient-Test-API-App/wiki/Credits-and-Licensing) · [Home](https://github.com/GGadash/AirGradient-Test-API-App/wiki)

## Compact parameter lists (v2.3.0-rc.2)

Click a map location to see a scrollable popup with PM2.5/AQI as the headline and
small parameter/value rows. Device cards show the same list: PM2.5, PM10, PM1,
particle count, CO2, NO2, O3, temperature, relative humidity and pressure, followed
by every additional measurement returned by the API. NO2 and O3 use the same
compact styling as the other fields. Original JSON and metadata remain available
in the details. The supplementary edition keeps its raw-PM2.5 headline and does
not calculate AQI. The main app labels raw/corrected PM2.5 separately; compact
rows retain the original API fields and units.

- **N/A**: known unsupported by this model (currently dedicated NO2/O3 on non-gas models).
- **N/D**: no usable reading in an expected or explicitly returned API field. This may mean a missing sample, null/invalid data or an endpoint limitation; a field's presence alone does not prove hardware support.
- **—**: not reported, and model support has not been established (for example, omitted pressure). Absence is not treated as proof of unsupported hardware.

A legend accompanies each list; hover a row for its explanation. Zero and negative
values remain unchanged; negative gas concentrations have a warning. Units are
shown when known, and unknown units are explicitly left unspecified. Stale and
retained readings keep their timestamp/status labels. Numerical compact values
use up to six decimal places; the raw JSON retains the original response.
