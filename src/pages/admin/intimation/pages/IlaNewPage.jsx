import React, { useState } from 'react';
import { PALETTE } from '../../adminTheme';
import { SectionCard, Field, TextField } from '../components/FormFields';

const initialForm = {
    vehicleRegNumber: '', make: '', model: '', variant: '',
    fuelType: '', engineNumber: '', chassisNumber: '', odometerReading: '',
    bodyType: '', color: '', vehicleAge: '',
};

const IlaNewPage = () => {
    const [form, setForm] = useState(initialForm);
    const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

    return (
        <main style={{ padding: '20px 24px' }}>
            <h1 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 800, color: PALETTE.primaryBlue }}>ILA - New</h1>

            <SectionCard number={1} title="General Details">
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
        </main>
    );
};

export default IlaNewPage;
