import React, { useState } from 'react';
import { PALETTE } from '../../adminTheme';
import DocumentManagementPanel from '../components/DocumentManagementPanel';
import {
    SectionCard, Field, TextField, SelectField, TextAreaField, RadioYesNo,
} from '../components/FormFields';

const DL_CLASS_OPTIONS = ['LMV', 'MCWG', 'HGV', 'MGV', 'Transport'];
const INJURY_OPTIONS = ['None', 'Minor', 'Major', 'Fatal'];
const RELATIONSHIP_OPTIONS = ['Self', 'Spouse', 'Parent', 'Child', 'Sibling', 'Other'];
const TYPE_OF_LOSS_OPTIONS = ['Accident', 'Fire', 'Theft', 'Natural Calamity', 'Malicious Act'];
const VEHICLE_CONDITION_OPTIONS = ['Driveable', 'Not Driveable', 'Total Loss'];

const RC_DETAILS = [
    ['Owner Name', 'Amit Verma'], ['Registration Date', '12 Jan 2021'], ['Valid Upto', '11 Jan 2036'],
    ['Vehicle Class', 'Motor Car'], ['Chassis Number', 'MAN123456789012'], ['RC Status', 'Active'],
    ['Engine Number', 'DOM202402400'],
];
const DL_DETAILS = [
    ['DL Holder Name', 'Amit Verma'], ['DL Valid Upto', '12 Jan 2021'], ['DL Vehicle Class', '11 Jan 2036'],
    ['DL Issuing RTO', 'Mumbai'],
];

const AI_ASSESSMENT_ROWS = [
    { part: 'Front Bumper', damageType: 'Cracked', severity: 'Moderate', decision: 'Repair', confidence: 92 },
    { part: 'Bonnet', damageType: 'Dented', severity: 'Minor', decision: 'Repair', confidence: 85 },
    { part: 'Left Headlight', damageType: 'Broken', severity: 'Moderate', decision: 'Replace', confidence: 90 },
    { part: 'Left Fender', damageType: 'Scratched', severity: 'Minor', decision: 'Repair', confidence: 80 },
    { part: 'Radiator', damageType: 'No Damage', severity: 'Minor', decision: 'No Action', confidence: 95 },
];

const DataRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${PALETTE.borderLight}`, fontSize: 13 }}>
        <span style={{ color: PALETTE.muted }}>{label}</span>
        <span style={{ fontWeight: 700, color: PALETTE.body }}>{value}</span>
    </div>
);

const StatBox = ({ label, value }) => (
    <div style={{ flex: '1 1 160px', background: '#F3F6FB', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: '12px 16px' }}>
        <p style={{ margin: 0, fontSize: 11, color: PALETTE.muted, fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: PALETTE.primaryBlue }}>{value}</p>
    </div>
);

const th = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#374151', borderBottom: `1px solid ${PALETTE.cardBorder}` };
const td = { padding: '9px 12px', fontSize: 13, color: PALETTE.body, borderBottom: '1px solid #F3F4F6' };

const initialForm = {
    vehicleRegNumber: '', make: '', model: '', variant: '', fuelType: '', engineNumber: '',
    chassisNumber: '', odometerReading: '', bodyType: '', color: '', vehicleAge: '',
    driverName: '', driverContactNumber: '', driverLicenseNumber: '', dlValidUpto: '',
    dlClassType: '', dlIssuingState: '', driverInjuryStatus: '', relationshipToInsured: '',
    typeOfLoss: '', causeOfAccident: '', partsDamage: '', airbagDeployed: '',
    vehicleCondition: '', workshopEstimateReceived: '', estimatedRepairCost: '',
    workshopEstimateDoc: '', descriptionOfLoss: '',
};

/**
 * "Handler" screen — the claim handler's working view: vehicle/driver/loss
 * details they can edit, plus a read-only AI Assessment summary carried
 * over from the AI ILA stage (see AiIlaAssessmentPage.jsx) for reference.
 */
const ClaimHandlerPage = () => {
    const [form, setForm] = useState(initialForm);
    const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleExtractFill = (extracted) => setForm((prev) => ({
        ...prev,
        vehicleRegNumber: extracted.vehicleRegNumber,
        make: extracted.make,
        model: extracted.model,
        engineNumber: extracted.engineNumber,
        chassisNumber: extracted.chassisNumber,
    }));

    return (
        <main className="im-page-flex" style={{ padding: '20px 24px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 800, color: PALETTE.primaryBlue }}>Handler</h1>

                <SectionCard number={1} title="Vehicle Information">
                    <Field label="Vehicle Reg Number"><TextField value={form.vehicleRegNumber} onChange={set('vehicleRegNumber')} placeholder="e.g. MP04 AB 1234" /></Field>
                    <Field label="Make"><TextField value={form.make} onChange={set('make')} placeholder="e.g. Maruti Suzuki" /></Field>
                    <Field label="Model"><TextField value={form.model} onChange={set('model')} placeholder="e.g. Swift" /></Field>
                    <Field label="Varent"><TextField value={form.variant} onChange={set('variant')} placeholder="e.g. VXI" /></Field>
                    <Field label="Fuel Type"><TextField value={form.fuelType} onChange={set('fuelType')} placeholder="e.g. Petrol" /></Field>
                    <Field label="Engine Number"><TextField value={form.engineNumber} onChange={set('engineNumber')} placeholder="Enter engine number" /></Field>
                    <Field label="Chassis Number"><TextField value={form.chassisNumber} onChange={set('chassisNumber')} placeholder="Enter chassis number" /></Field>
                    <Field label="Odometer Reading (KM)"><TextField value={form.odometerReading} onChange={set('odometerReading')} placeholder="e.g. 45,876" /></Field>
                    <Field label="Body Type"><TextField value={form.bodyType} onChange={set('bodyType')} placeholder="e.g. Sedan" /></Field>
                    <Field label="Color"><TextField value={form.color} onChange={set('color')} placeholder="e.g. White" /></Field>
                    <Field label="Vehicle Age"><TextField value={form.vehicleAge} onChange={set('vehicleAge')} placeholder="e.g. 3 Years" /></Field>
                </SectionCard>

                <SectionCard number={2} title="Driver Information">
                    <Field label="Driver Name"><TextField value={form.driverName} onChange={set('driverName')} placeholder="Enter driver's full name" /></Field>
                    <Field label="Drier Contact Number"><TextField value={form.driverContactNumber} onChange={set('driverContactNumber')} placeholder="+91 1234567890" /></Field>
                    <Field label="Driver License Number"><TextField value={form.driverLicenseNumber} onChange={set('driverLicenseNumber')} placeholder="e.g. MH01 20230012345" /></Field>
                    <Field label="DL Valid Upto"><TextField value={form.dlValidUpto} onChange={set('dlValidUpto')} placeholder="e.g. 11 Jan 2036" /></Field>
                    <Field label="DL Class Type"><SelectField value={form.dlClassType} onChange={set('dlClassType')} options={DL_CLASS_OPTIONS} /></Field>
                    <Field label="DL Issuing State"><TextField value={form.dlIssuingState} onChange={set('dlIssuingState')} placeholder="e.g. Maharashtra" /></Field>
                    <Field label="Driver Injury Status"><SelectField value={form.driverInjuryStatus} onChange={set('driverInjuryStatus')} options={INJURY_OPTIONS} /></Field>
                    <Field label="Relationship To Insured"><SelectField value={form.relationshipToInsured} onChange={set('relationshipToInsured')} options={RELATIONSHIP_OPTIONS} /></Field>
                </SectionCard>

                <SectionCard number={3} title="Loss Details">
                    <Field label="Type Of Loss"><SelectField value={form.typeOfLoss} onChange={set('typeOfLoss')} options={TYPE_OF_LOSS_OPTIONS} /></Field>
                    <Field label="Cause Of Accident"><TextField value={form.causeOfAccident} onChange={set('causeOfAccident')} placeholder="Enter cause of accident" /></Field>
                    <Field label="Parts Damage"><TextField value={form.partsDamage} onChange={set('partsDamage')} placeholder="e.g. Front bumper, hood" /></Field>
                    <Field label="Airbag Deployed"><RadioYesNo name="airbagDeployed" value={form.airbagDeployed} onChange={set('airbagDeployed')} /></Field>
                    <Field label="Vehicle Condition"><SelectField value={form.vehicleCondition} onChange={set('vehicleCondition')} options={VEHICLE_CONDITION_OPTIONS} /></Field>
                    <Field label="Workshop Estimate Received"><RadioYesNo name="workshopEstimateReceived" value={form.workshopEstimateReceived} onChange={set('workshopEstimateReceived')} /></Field>
                    <Field label="Estimated Repair Cost"><TextField value={form.estimatedRepairCost} onChange={set('estimatedRepairCost')} placeholder="e.g. 55,000" /></Field>
                    <Field label="Workshop Estimate Doc"><TextField value={form.workshopEstimateDoc} onChange={set('workshopEstimateDoc')} placeholder="Attached file name" /></Field>
                    <Field label="Description Of Loss" full><TextAreaField value={form.descriptionOfLoss} onChange={set('descriptionOfLoss')} placeholder="Describe how the loss occurred" rows={3} /></Field>
                </SectionCard>

                <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: PALETTE.primaryBlue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>4</span>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PALETTE.body }}>Vahan Data</h2>
                    </div>
                    <div className="im-form-grid">
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: PALETTE.primaryBlue }}>RC (Registration Certificate) Details</p>
                            {RC_DETAILS.map(([label, value]) => <DataRow key={label} label={label} value={value} />)}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: PALETTE.primaryBlue }}>DL (Driving License Status)</p>
                            {DL_DETAILS.map(([label, value]) => <DataRow key={label} label={label} value={value} />)}
                        </div>
                    </div>
                </div>

                <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: PALETTE.primaryBlue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>5</span>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PALETTE.body }}>AI Assessment (Read-Only)</h2>
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 11, color: PALETTE.muted }}>Carried over from the AI ILA damage assessment for this claim.</p>

                    <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
                        <StatBox label="AI Confidence Score" value="87%" />
                        <StatBox label="Damage Severity" value="Moderate" />
                        <StatBox label="Photos Count Analysed" value="5 Of 7" />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB' }}>
                                    <th style={th}>Part Name</th><th style={th}>Damage Type</th><th style={th}>Severity</th>
                                    <th style={th}>AI Decision</th><th style={th}>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AI_ASSESSMENT_ROWS.map((row) => (
                                    <tr key={row.part}>
                                        <td style={{ ...td, fontWeight: 700 }}>{row.part}</td>
                                        <td style={td}>{row.damageType}</td>
                                        <td style={td}>{row.severity}</td>
                                        <td style={td}>{row.decision}</td>
                                        <td style={td}>{row.confidence}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="im-button-bar">
                    <button style={{ flex: 1, padding: '12px', background: '#fff', color: PALETTE.primaryBlue, border: `1px solid ${PALETTE.primaryBlue}`, borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        Save Details
                    </button>
                    <button style={{ flex: 1, padding: '12px', background: PALETTE.primaryBlue, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        Submit Details
                    </button>
                </div>
            </div>

            <DocumentManagementPanel stageName="Claim Details" onExtractFill={handleExtractFill} />
        </main>
    );
};

export default ClaimHandlerPage;
