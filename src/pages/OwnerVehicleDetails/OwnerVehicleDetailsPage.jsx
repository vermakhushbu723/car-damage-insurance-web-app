import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { setProduct } from '../../store/vehicleSlice';

// Reusable Input Field
const InputField = ({ label, placeholder, value, onChange, type = 'text', prefix }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textPrimary }}>
            {label}
        </label>
        <div
            className="flex items-center gap-2 px-4 py-2 rounded-md border"
            style={{ background: COLORS.bgInput, borderColor: COLORS.borderInput }}
        >
            {prefix && (
                <span className="text-sm font-semibold shrink-0" style={{ color: COLORS.textSecondary }}>
                    {prefix}
                </span>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: COLORS.textPrimary }}
            />
        </div>
    </div>
);

// Reusable Select Field - Custom Dropdown
const SelectField = ({ label, placeholder, value, onChange, options = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5 " style={{ color: COLORS.textPrimary }}>
                {label}
            </label>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer"
                    style={{ background: COLORS.bgInput, borderColor: COLORS.borderInput }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex-1 text-sm" style={{ color: value ? COLORS.textPrimary : COLORS.textSecondary }}>
                        {value || placeholder}
                    </span>
                    <DownOutlined style={{ color: COLORS.textSecondary, fontSize: 12, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>

                {isOpen && (
                    <ul
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: COLORS.bgHeader,
                            border: `1px solid ${COLORS.borderInput}`,
                            borderRadius: '6px',
                            marginTop: '4px',
                            zIndex: 10,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {options.map((opt) => (
                            <li
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    color: COLORS.textPrimary,
                                    fontSize: '14px',
                                    backgroundColor: opt === value ? COLORS.bgInput : 'transparent',
                                    borderBottom: `1px solid ${COLORS.borderInput}`
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#e8f0f8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = opt === value ? COLORS.bgInput : 'transparent';
                                }}
                            >
                                {opt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const OwnerVehicleDetailsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        ownerName: '',
        mobile: '',
        email: '',
        odometer: '',
        registrationNumber: '',
        state: '',
        registrationDate: '',
        product: '',
        make: '',
        model: '',
        variant: '',
        manufacturingYear: '',
    });

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const handleNext = () => {
        // Persist the chosen product so the camera flow downstream
        // (PhotoCaptureSelectionPage / CameraCapturePage) can pick the
        // matching silhouette + angle guides (car / bike / truck).
        dispatch(setProduct(form.product || null));
        navigate(ROUTES.DOCUMENT_UPLOAD);
    };

    return (
        <div className="min-h-screen flex flex-col" >
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar title="Owner & Vehicle Details" />

            {/* Form */}
            <div className="flex-1 px-4 pt-5 pb-6 overflow-y-auto main-bg">
                <InputField
                    label="Owner Name"
                    placeholder="Naman Singh"
                    value={form.ownerName}
                    onChange={set('ownerName')}
                />

                <InputField
                    label="Mobile Number"
                    placeholder="9910478839"
                    value={form.mobile}
                    onChange={set('mobile')}
                    type="tel"
                    prefix="+91"
                />

                <InputField
                    label="Email ID"
                    placeholder="UserName@gmail.com"
                    value={form.email}
                    onChange={set('email')}
                    type="email"
                />

                <InputField
                    label="Odometer Reading ( KM )"
                    placeholder="5000"
                    value={form.odometer}
                    onChange={set('odometer')}
                    type="number"
                />

                <InputField
                    label="Registration Number"
                    placeholder="MH 49 DS 2345"
                    value={form.registrationNumber}
                    onChange={set('registrationNumber')}
                />

                <SelectField
                    label="Select State"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={set('state')}
                    options={['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal']}
                />

                <SelectField
                    label="Registration Date"
                    placeholder="dd-mm-yyyy"
                    value={form.registrationDate}
                    onChange={set('registrationDate')}
                    options={['2020', '2021', '2022', '2023', '2024', '2025']}
                />

                <SelectField
                    label="Select Product"
                    placeholder="Private Car"
                    value={form.product}
                    onChange={set('product')}
                    options={['Private Car', 'Two Wheeler', 'Commercial Vehicle', 'Taxi']}
                />

                <SelectField
                    label="Select Make"
                    placeholder="Mahindra"
                    value={form.make}
                    onChange={set('make')}
                    options={['Mahindra', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford', 'Kia']}
                />

                <SelectField
                    label="Select Model"
                    placeholder="Scorpio-N"
                    value={form.model}
                    onChange={set('model')}
                    options={['Scorpio-N', 'XUV 700', 'Thar', 'Bolero', 'XUV 300']}
                />

                <SelectField
                    label="Select Variant"
                    placeholder="Z2"
                    value={form.variant}
                    onChange={set('variant')}
                    options={['Z2', 'Z4', 'Z6', 'Z8', 'Z8L']}
                />

                <SelectField
                    label="Select Manufacturing Year"
                    placeholder="mm/yyyy"
                    value={form.manufacturingYear}
                    onChange={set('manufacturingYear')}
                    options={['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']}
                />

                <BottomButton label="Next" onClick={handleNext} />
            </div>
        </div>
    );
};

export default OwnerVehicleDetailsPage;
