import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';
import DocumentManagementPanel from '../components/DocumentManagementPanel';
import { SectionCard, Field, TextField, DateField } from '../components/FormFields';
import { ROUTES } from '../../../../constants/routes';

const READ_ONLY_STYLE = {
    width: '100%', padding: '10px 12px', borderRadius: 6,
    border: `1px solid ${PALETTE.cardBorder}`, background: '#F3F4F6',
    fontSize: 13, color: PALETTE.body, boxSizing: 'border-box',
};
const ReadOnlyField = ({ label, value }) => (
    <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: PALETTE.primaryBlue, marginBottom: 6, display: 'block' }}>{label}</label>
        <div style={READ_ONLY_STYLE}>{value}</div>
    </div>
);

const LOSS_DETAILS_ROWS = [
    ['Date Of Intimation', '19/07/2026, 12:20 PM'], ['Nearst Landmark', 'Near Metro Pillar No 123'],
    ['Loss Date', '15/07/2026'], ['Pincode', '400001'],
    ['Loss Time', '02:20 AM'], ['City', 'Bhopal'],
    ['Nature Of Loss', 'Accident External Means'], ['State', 'Madhya Pradesh'],
    ['Delay In Intimation (In Days)', '05 Days'], ['Area', 'MP Nagar'],
    ['Close', 'Formula = 15 Days (Loss Date - Policy Inception)'], ['Claim Servicing Office', 'Bhopal'],
    ['Brief Description Of Loss', 'Vehicle Hit The Divider While Overtaking Front Vehicle, Bumper Damaged'], ['Claim Servicing Region', 'Center'],
    ['Catastrophic Loss?', 'No'], ['Catastrophic Code', '1234567890'],
    ['No Of Occupants During Accident', '02'], ['Injury / Death During Accident?', 'No'],
    ['Vehicle At Police Station', 'No'], ['Police Station Details', 'MP Nager Police Station'],
];

const WORKSHOP_FIELDS = [
    ['Workshop Name', 'XYZ Motors'], ['Type Of Workshop', 'Dealer'],
    ['Estimate Date', '18 May 2025'], ['Loss Estimate Ammount', '55,000'],
    ['Estimate Received Date', '18 May 2025'], ['GST Number', '23AMC56678124PQR'],
    ['Estimated Received Date', '18 May 2025'],
];

const VEHICLE_DETAILS_ROWS = [
    ['Vehicle Number', 'MP04AB1234', 'MP04AB1234'],
    ['Name Of Registered Owner', 'Amit Verma', 'Amit Verma'],
    ['Non-Registered', 'BH Series', 'BH Series'],
    ['Date Of 1st Registration', '12 Jan 2021', '12 Jan 2021'],
    ['Chassis Number', 'MA1AB2CD3EFG12345', 'MA1AB2CD3EFG12345'],
    ['Chassis No. As Per Physical Verification', 'OCR From Photo Of Chassis Number', 'Validation Verification Check & Match Of Chassis Number Match'],
    ['Seating Capacity', '5', 'As Per Vahan'],
    ['Type Of Body', 'Sedan', 'As Per Vahan'],
];

const WorkshopDetailsSection = ({ number }) => (
    <SectionCard number={number} title="Workshop Details">
        {WORKSHOP_FIELDS.map(([label, value]) => <ReadOnlyField key={label} label={label} value={value} />)}
    </SectionCard>
);

const initialForm = {
    policyNumber: '', policyType: '', policyStartingDate: '', policyEndingDate: '',
    sumInsured: '', insuredName: '', claimHandlerName: '', survivorName: '',
    indemnidentlyReserve: '', tat: '', riskRating: '',
    driverNameAsPerIntimation: 'Suresh Kumar', driverNameAsClaimForm: 'Suresh Kumar',
    dlNumber: 'MH 012586', nonTransport: '', transport: '',
    updatedMobileNo: '9876543210', email: 'Amit.Verma@Gmail.Com', whatsappNumber: '9876543210',
    dob: '15 Aug 1985', panNo: 'ABCDE1234F', panDetails: '18 May 2025',
    aadhaarNo: '1234 5678 9123', occupation: 'Private Service', ckycNumber: 'CKYC123456789012',
    whatsappUpdates: true,
    vehicleNumberAsPerPermit: 'MP04AB1234', permitHolderName: 'Amit Verma', gvw: '15000',
    permitNo: 'MP/2025/123456', permitValidity: 'ABCDE1234F', fitnessNumber: '(Not Available)',
    fitnessValidity: '31 Mar 2026', roadTaxPaid: 'Yes', wasVehicleLoaded: 'No',
    loadedComfortKgs: '0', unladenWeight: '1050', permitType: 'National Permit',
    loadChallanNumber: 'LC/2025/12345', numberOfPassengers: '5', loadChallanWeight: '0',
};

const ClaimDetailsPage = () => {
    const navigate = useNavigate();
    const [vehicleType, setVehicleType] = useState('LMV');
    const [form, setForm] = useState(initialForm);
    const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleExtractFill = (extracted) => setForm((prev) => ({ ...prev, insuredName: extracted.ownerName }));

    return (
        <main style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: PALETTE.primaryBlue }}>Claim Details</h1>
                <button
                    onClick={() => navigate(ROUTES.INTIMATION.CLAIM_DETAILS_ANALYTICS)}
                    style={{ padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1px solid ${PALETTE.cardBorder}`, background: '#fff', color: PALETTE.muted }}
                >
                    View Analytics →
                </button>
            </div>
            <div className="im-page-flex">
            <div style={{ flex: 1, minWidth: 0 }}>
                <SectionCard number={1} title="Vehicle Information">
                    <Field label="Policy Number"><TextField value={form.policyNumber} onChange={set('policyNumber')} placeholder="POL-XXXXXX-XXXXX" /></Field>
                    <Field label="Policy Type"><TextField value={form.policyType} onChange={set('policyType')} placeholder="e.g. Comprehensive" /></Field>
                    <Field label="Policy Starting Date"><DateField value={form.policyStartingDate} onChange={set('policyStartingDate')} /></Field>
                    <Field label="Policy Ending Date"><DateField value={form.policyEndingDate} onChange={set('policyEndingDate')} /></Field>
                    <Field label="Sum Insured"><TextField value={form.sumInsured} onChange={set('sumInsured')} placeholder="e.g. 8,50,000" /></Field>
                    <Field label="Insured Name"><TextField value={form.insuredName} onChange={set('insuredName')} placeholder="Enter insured person's name" /></Field>
                    <Field label="Claim Handler Name"><TextField value={form.claimHandlerName} onChange={set('claimHandlerName')} placeholder="Enter handler's name" /></Field>
                    <Field label="Survivor Name"><TextField value={form.survivorName} onChange={set('survivorName')} placeholder="Enter survivor's name" /></Field>
                    <Field label="Indemnidently Reserve"><TextField value={form.indemnidentlyReserve} onChange={set('indemnidentlyReserve')} placeholder="e.g. 50,000" /></Field>
                    <Field label="TAT"><TextField value={form.tat} onChange={set('tat')} placeholder="e.g. 7 Days" /></Field>
                    <Field label="Risk Rating"><TextField value={form.riskRating} onChange={set('riskRating')} placeholder="e.g. Low / Medium / High" /></Field>
                </SectionCard>

                <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: PALETTE.primaryBlue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>2</span>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PALETTE.body }}>Loss Details</h2>
                    </div>
                    <p style={{ margin: '0 0 16px 36px', fontSize: 11, color: PALETTE.primaryBlue, fontWeight: 600 }}>
                        Details Of Loss As Per Intimation (Intimation Page Details Will Fetched)
                    </p>
                    <div className="im-form-grid">
                        {LOSS_DETAILS_ROWS.map(([label, value]) => (
                            <ReadOnlyField key={label} label={label} value={value} />
                        ))}
                    </div>
                </div>

                <WorkshopDetailsSection number={3} />
                <WorkshopDetailsSection number={4} />

                <SectionCard number={5} title="Driver Details">
                    <Field label="Driver Name (As Per Intimation)"><TextField value={form.driverNameAsPerIntimation} onChange={set('driverNameAsPerIntimation')} placeholder="Enter driver's name" /></Field>
                    <Field label="Driver Name (As Claim Form)"><TextField value={form.driverNameAsClaimForm} onChange={set('driverNameAsClaimForm')} placeholder="Enter driver's name" /></Field>
                    <Field label="DL Number"><TextField value={form.dlNumber} onChange={set('dlNumber')} placeholder="e.g. MH01 20230012345" /></Field>
                    <Field label="Non-Transport"><TextField value={form.nonTransport} onChange={set('nonTransport')} placeholder="Non-Transport vehicle registration date" /></Field>
                    <Field label="Transport"><TextField value={form.transport} onChange={set('transport')} placeholder="Transport vehicle registration date" /></Field>
                    <Field label="Vehicle Type">
                        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', height: 40, alignItems: 'center' }}>
                            {['LMV', 'MCWOG', 'MCWG', 'HGV', 'MGV'].map((t) => (
                                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                    <input type="checkbox" checked={vehicleType === t} onChange={() => setVehicleType(t)} />
                                    {t}
                                </label>
                            ))}
                        </div>
                    </Field>
                </SectionCard>

                <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: PALETTE.primaryBlue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>6</span>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PALETTE.body }}>Vehicle Details</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: PALETTE.primaryBlue }}>Field</th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: PALETTE.primaryBlue }}>As Per RC</th>
                                    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: PALETTE.primaryBlue }}>As Per Vahan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {VEHICLE_DETAILS_ROWS.map(([field, rc, vahan]) => (
                                    <tr key={field} style={{ borderTop: `1px solid ${PALETTE.borderLight}` }}>
                                        <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: PALETTE.body }}>{field}</td>
                                        <td style={{ padding: '10px 12px', fontSize: 13, color: PALETTE.body }}>{rc}</td>
                                        <td style={{ padding: '10px 12px', fontSize: 13, color: PALETTE.body }}>{vahan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <SectionCard number={7} title="Insured Details Updation">
                    <Field label="Updated Mobile No"><TextField value={form.updatedMobileNo} onChange={set('updatedMobileNo')} placeholder="+91 1234567890" /></Field>
                    <Field label="E-Mail ID"><TextField value={form.email} onChange={set('email')} type="email" placeholder="name@example.com" /></Field>
                    <Field label="WhatsApp Number"><TextField value={form.whatsappNumber} onChange={set('whatsappNumber')} placeholder="+91 1234567890" /></Field>
                    <Field label="DOB"><TextField value={form.dob} onChange={set('dob')} placeholder="e.g. 15 Aug 1985" /></Field>
                    <Field label="PAN No"><TextField value={form.panNo} onChange={set('panNo')} placeholder="e.g. ABCDE1234F" /></Field>
                    <Field label="PAN Verification"><button style={{ padding: '10px', borderRadius: 6, border: `1px solid ${PALETTE.primaryBlue}`, background: '#fff', color: PALETTE.primaryBlue, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Validate PAN</button></Field>
                    <Field label="PAN Details"><TextField value={form.panDetails} onChange={set('panDetails')} placeholder="Enter PAN verification date" /></Field>
                    <Field label="Aadhaar No"><TextField value={form.aadhaarNo} onChange={set('aadhaarNo')} placeholder="e.g. 1234 5678 9123" /></Field>
                    <Field label="Occupation"><TextField value={form.occupation} onChange={set('occupation')} placeholder="e.g. Private Service" /></Field>
                    <Field label="CKYC Number"><TextField value={form.ckycNumber} onChange={set('ckycNumber')} placeholder="e.g. CKYC123456789012" /></Field>
                    <Field label="WhatsApp Updates" full>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <input type="checkbox" checked={form.whatsappUpdates} onChange={(e) => set('whatsappUpdates')(e.target.checked)} /> I Agree To Get Updates On WhatsApp
                        </label>
                    </Field>
                </SectionCard>

                <SectionCard number={8} title="Commercial Vehicle Details">
                    <Field label="Vehicle Number As Per Permit"><TextField value={form.vehicleNumberAsPerPermit} onChange={set('vehicleNumberAsPerPermit')} placeholder="e.g. MP04 AB 1234" /></Field>
                    <Field label="Permit Holder Name"><TextField value={form.permitHolderName} onChange={set('permitHolderName')} placeholder="Enter permit holder's name" /></Field>
                    <Field label="GVW"><TextField value={form.gvw} onChange={set('gvw')} placeholder="e.g. 15000" /></Field>
                    <Field label="Permit No"><TextField value={form.permitNo} onChange={set('permitNo')} placeholder="e.g. MP/2025/123456" /></Field>
                    <Field label="Permit Validity"><TextField value={form.permitValidity} onChange={set('permitValidity')} placeholder="Enter permit validity" /></Field>
                    <Field label="Fitness Number"><TextField value={form.fitnessNumber} onChange={set('fitnessNumber')} placeholder="Enter fitness certificate number" /></Field>
                    <Field label="Fitness Validity"><TextField value={form.fitnessValidity} onChange={set('fitnessValidity')} placeholder="e.g. 31 Mar 2026" /></Field>
                    <Field label="Road Tax Paid"><TextField value={form.roadTaxPaid} onChange={set('roadTaxPaid')} placeholder="Yes / No" /></Field>
                    <Field label="Was The Vehicle Loaded?"><TextField value={form.wasVehicleLoaded} onChange={set('wasVehicleLoaded')} placeholder="Yes / No" /></Field>
                    <Field label="Loaded Comfort (Kgs)"><TextField value={form.loadedComfortKgs} onChange={set('loadedComfortKgs')} placeholder="e.g. 0" /></Field>
                    <Field label="Unladen Weight"><TextField value={form.unladenWeight} onChange={set('unladenWeight')} placeholder="e.g. 1050" /></Field>
                    <Field label="Permit Type"><TextField value={form.permitType} onChange={set('permitType')} placeholder="e.g. National Permit" /></Field>
                    <Field label="Load Challan Number"><TextField value={form.loadChallanNumber} onChange={set('loadChallanNumber')} placeholder="e.g. LC/2025/12345" /></Field>
                    <Field label="Number Of Passengers"><TextField value={form.numberOfPassengers} onChange={set('numberOfPassengers')} placeholder="e.g. 5" /></Field>
                    <Field label="Load Challan Weight"><TextField value={form.loadChallanWeight} onChange={set('loadChallanWeight')} placeholder="e.g. 0" /></Field>
                </SectionCard>

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
            </div>
        </main>
    );
};

export default ClaimDetailsPage;
