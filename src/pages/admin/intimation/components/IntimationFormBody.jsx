import React, { useState } from 'react';
import { PALETTE } from '../../adminTheme';
import DocumentManagementPanel from './DocumentManagementPanel';
import {
    SectionCard, Field, TextField, DateField, TimeField, SelectField,
    TextAreaField, RadioYesNo, SearchField,
} from './FormFields';

const NATURE_OF_LOSS_OPTIONS = ['Accident (External Means)', 'Fire', 'Theft', 'Natural Calamity', 'Malicious Act'];
const LINE_OF_BUSINESS_OPTIONS = ['Motor', 'Health', 'Property', 'Marine'];
const PRODUCT_TYPE_OPTIONS = ['Private Car', 'Two-Wheeler', 'Commercial Vehicle'];
const STATE_OPTIONS = ['Madhya Pradesh', 'Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Rajasthan'];
const RELATIONSHIP_OPTIONS = ['Self', 'Spouse', 'Parent', 'Child', 'Sibling', 'Other'];
const DRIVER_INJURED_OPTIONS = ['None', 'Minor', 'Major', 'Fatal'];
const WORKSHOP_TYPE_OPTIONS = ['Dealer', 'Non-Dealer', 'Authorized Multi-Brand'];

const initialForm = {
    userName: '', userContactNumber: '', insurerCode: '', insurerName: '',
    policyIssuanceBranch: '', claimReportedBranch: '',
    policyNo: '', claimNumber: '', policyInceptionDate: '', policyExpireDate: '',
    intimationDate: '', intimationTime: '', engineNumber: '', chassisNumber: '',
    lineOfBusiness: '', productType: '', policyIssueBranch: '', closeNotificationRemark: '',
    insuredName: '',
    dateOfAccident: '', timeOfAccident: '', natureOfLoss: '', injuredDuringAccident: '',
    driverFullName: '', driverContactNumber: '', driverEmailAddress: '', driverLicenseNumber: '',
    relationshipToInsured: '', driverInjured: '',
    lossLocation: '', city: '', state: '', pincode: '', nearestLandmark: '', currentLocationOfVehicle: '',
    descriptionOfLoss: '', vehicleAtPoliceStation: '', policeStationDetails: '',
    isVehicleAtWorkshop: '', workshopName: '', workshopType: '', workshopPinCity: '',
    workshopContactNumber: '', workshopState: '', estimatedAmount: '',
    otherDetails: '',
    manualInspectionLink: '', assignmentContactNumber: '',
};

/**
 * Shared body for the "Intimation" and "Surveyor Allocation" screens — the
 * Figma design uses the identical 7-section form for both, differing only
 * in the page title.
 */
const IntimationFormBody = ({ title }) => {
    const [form, setForm] = useState(initialForm);
    const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    // Only fields this form actually has get filled -- an RC copy has no
    // "Loss Location" or "Workshop Name" to extract, for instance.
    const handleExtractFill = (extracted) => setForm((prev) => ({
        ...prev,
        insuredName: extracted.ownerName,
        engineNumber: extracted.engineNumber,
        chassisNumber: extracted.chassisNumber,
    }));

    return (
        <main className="im-page-flex" style={{ padding: '20px 24px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 800, color: PALETTE.primaryBlue }}>{title}</h1>

                <SectionCard number={1} title="Caller & Insurer Details">
                    <Field label="User Name"><TextField value={form.userName} onChange={set('userName')} placeholder="Enter caller's full name" /></Field>
                    <Field label="User Contact Number"><TextField value={form.userContactNumber} onChange={set('userContactNumber')} placeholder="+91 1234567890" /></Field>
                    <Field label="Insurer Code"><TextField value={form.insurerCode} onChange={set('insurerCode')} placeholder="e.g. ICICI01" /></Field>
                    <Field label="Insurer Name"><TextField value={form.insurerName} onChange={set('insurerName')} placeholder="Auto-filled from Insurer Code" /></Field>
                    <Field label="Policy Issuance Branch"><TextField value={form.policyIssuanceBranch} onChange={set('policyIssuanceBranch')} placeholder="e.g. Mumbai" /></Field>
                    <Field label="Claim Reported Branch"><TextField value={form.claimReportedBranch} onChange={set('claimReportedBranch')} placeholder="e.g. Mumbai" /></Field>
                </SectionCard>

                <SectionCard number={2} title="Policy Details">
                    <Field label="Policy No"><TextField value={form.policyNo} onChange={set('policyNo')} placeholder="POL-XXXXXX-XXXXX" /></Field>
                    <Field label="Claim Number"><TextField value={form.claimNumber} onChange={set('claimNumber')} placeholder="Auto-generated on submit" /></Field>
                    <Field label="Policy Inception Date"><DateField value={form.policyInceptionDate} onChange={set('policyInceptionDate')} /></Field>
                    <Field label="Policy Expire Date"><DateField value={form.policyExpireDate} onChange={set('policyExpireDate')} /></Field>
                    <Field label="Intimation Date"><DateField value={form.intimationDate} onChange={set('intimationDate')} /></Field>
                    <Field label="Time"><TimeField value={form.intimationTime} onChange={set('intimationTime')} /></Field>
                    <Field label="Engine Number"><TextField value={form.engineNumber} onChange={set('engineNumber')} placeholder="Enter engine number" /></Field>
                    <Field label="Chassis Number"><TextField value={form.chassisNumber} onChange={set('chassisNumber')} placeholder="Enter chassis number" /></Field>
                    <Field label="Line Of Business"><SelectField value={form.lineOfBusiness} onChange={set('lineOfBusiness')} options={LINE_OF_BUSINESS_OPTIONS} /></Field>
                    <Field label="Product Type"><SelectField value={form.productType} onChange={set('productType')} options={PRODUCT_TYPE_OPTIONS} /></Field>
                    <Field label="Policy Issue Branch"><TextField value={form.policyIssueBranch} onChange={set('policyIssueBranch')} placeholder="e.g. Mumbai" /></Field>
                    <Field label="Close Notification Remark"><TextAreaField value={form.closeNotificationRemark} onChange={set('closeNotificationRemark')} placeholder="Enter Remarks" rows={3} /></Field>
                    <Field label="Insured Name"><TextField value={form.insuredName} onChange={set('insuredName')} placeholder="Enter insured person's name" /></Field>
                </SectionCard>

                <SectionCard number={3} title="Accident Details">
                    <Field label="Date Of Accident"><DateField value={form.dateOfAccident} onChange={set('dateOfAccident')} /></Field>
                    <Field label="Time Of Accident"><TimeField value={form.timeOfAccident} onChange={set('timeOfAccident')} /></Field>
                    <Field label="Nature Of Loss"><SelectField value={form.natureOfLoss} onChange={set('natureOfLoss')} options={NATURE_OF_LOSS_OPTIONS} /></Field>
                    <Field label="Injure / Death During Accident"><RadioYesNo name="injuredDuringAccident" value={form.injuredDuringAccident} onChange={set('injuredDuringAccident')} /></Field>
                    <Field label="Driver Full Name"><TextField value={form.driverFullName} onChange={set('driverFullName')} placeholder="Enter driver's full name" /></Field>
                    <Field label="Driver Contact Number"><TextField value={form.driverContactNumber} onChange={set('driverContactNumber')} placeholder="+91 1234567890" /></Field>
                    <Field label="Driver Email Address"><TextField value={form.driverEmailAddress} onChange={set('driverEmailAddress')} type="email" placeholder="driver@example.com" /></Field>
                    <Field label="Driver License Number"><TextField value={form.driverLicenseNumber} onChange={set('driverLicenseNumber')} placeholder="e.g. MH01 20230012345" /></Field>
                    <Field label="Relationship To Insured"><SelectField value={form.relationshipToInsured} onChange={set('relationshipToInsured')} options={RELATIONSHIP_OPTIONS} /></Field>
                    <Field label="Driver Injured"><SelectField value={form.driverInjured} onChange={set('driverInjured')} options={DRIVER_INJURED_OPTIONS} placeholder="Select Injure" /></Field>
                </SectionCard>

                <SectionCard number={4} title="Loss Location">
                    <Field label="Loss Location"><TextField value={form.lossLocation} onChange={set('lossLocation')} placeholder="Enter loss location / address" /></Field>
                    <Field label="City"><TextField value={form.city} onChange={set('city')} placeholder="Enter city" /></Field>
                    <Field label="State"><SelectField value={form.state} onChange={set('state')} options={STATE_OPTIONS} /></Field>
                    <Field label="Pincode"><TextField value={form.pincode} onChange={set('pincode')} placeholder="e.g. 400001" /></Field>
                    <Field label="Nearst Landmark"><TextField value={form.nearestLandmark} onChange={set('nearestLandmark')} placeholder="e.g. Near Metro Pillar No 123" /></Field>
                    <Field label="Current Location Of Vehicle"><TextField value={form.currentLocationOfVehicle} onChange={set('currentLocationOfVehicle')} placeholder="Enter current vehicle location" /></Field>
                    <Field label="Discription Off Loss" full><TextAreaField value={form.descriptionOfLoss} onChange={set('descriptionOfLoss')} placeholder="Describe how the loss occurred" rows={3} /></Field>
                    <Field label="Vehicle At Police Station"><RadioYesNo name="vehicleAtPoliceStation" value={form.vehicleAtPoliceStation} onChange={set('vehicleAtPoliceStation')} /></Field>
                    <Field label="Police Station Details"><TextField value={form.policeStationDetails} onChange={set('policeStationDetails')} placeholder="e.g. MP Nagar Police Station" /></Field>
                </SectionCard>

                <SectionCard number={5} title="Workshop Details">
                    <Field label="Is The Vehicle At Workshop?" full><RadioYesNo name="isVehicleAtWorkshop" value={form.isVehicleAtWorkshop} onChange={set('isVehicleAtWorkshop')} /></Field>
                    <Field label="Workshop Name"><SearchField value={form.workshopName} onChange={set('workshopName')} placeholder="Search Workshop" /></Field>
                    <Field label="Workshop Type"><SelectField value={form.workshopType} onChange={set('workshopType')} options={WORKSHOP_TYPE_OPTIONS} /></Field>
                    <Field label="Workshop Pin / City"><TextField value={form.workshopPinCity} onChange={set('workshopPinCity')} placeholder="Pin / City" /></Field>
                    <Field label="Workshop Contact Number"><TextField value={form.workshopContactNumber} onChange={set('workshopContactNumber')} placeholder="Mobile Number" /></Field>
                    <Field label="State"><SelectField value={form.workshopState} onChange={set('workshopState')} options={STATE_OPTIONS} /></Field>
                    <Field label="Estimated Ammount"><TextField value={form.estimatedAmount} onChange={set('estimatedAmount')} placeholder="e.g. 55,000" /></Field>
                </SectionCard>

                <SectionCard number={6} title="Other Details">
                    <Field label="Others Details If Any?" full><TextAreaField value={form.otherDetails} onChange={set('otherDetails')} placeholder="No Other Details" rows={5} /></Field>
                </SectionCard>

                <SectionCard number={7} title="Assignment & Inspection">
                    <Field label="Manual Inspection Link"><TextField value={form.manualInspectionLink} onChange={set('manualInspectionLink')} placeholder="Link" /></Field>
                    <Field label="User Contact Number"><TextField value={form.assignmentContactNumber} onChange={set('assignmentContactNumber')} placeholder="+91 1234567890" /></Field>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <button style={{
                            width: '100%', padding: '12px', background: PALETTE.primaryBlue, color: '#fff',
                            border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}>
                            Send Link
                        </button>
                    </div>
                </SectionCard>

                <div className="im-button-bar">
                    <button style={{
                        flex: 1, padding: '12px', background: '#fff', color: PALETTE.primaryBlue,
                        border: `1px solid ${PALETTE.primaryBlue}`, borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}>
                        Save Details
                    </button>
                    <button style={{
                        flex: 1, padding: '12px', background: PALETTE.primaryBlue, color: '#fff',
                        border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}>
                        Submit Details
                    </button>
                </div>
            </div>

            <DocumentManagementPanel stageName="Claim Details" onExtractFill={handleExtractFill} />
        </main>
    );
};

export default IntimationFormBody;
