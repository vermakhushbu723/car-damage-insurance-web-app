import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DownOutlined, CalendarOutlined } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { setProduct } from '../../store/vehicleSlice';
import { usePageLoading } from '../../hooks/usePageLoading';

// Reusable Input Field
const InputField = ({ label, placeholder, value, onChange, type = 'text', prefix, onClick, readOnly, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textPrimary }}>
            {label}
        </label>
        <div
            className="flex items-center gap-2 px-4 py-2 rounded-md border"
            style={{ background: COLORS.bgInput, borderColor: error ? COLORS.statusPending : COLORS.borderInput, cursor: onClick ? 'pointer' : 'auto' }}
            onClick={onClick}
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
                onChange={readOnly || onClick ? undefined : (e) => onChange(e.target.value)}
                readOnly={readOnly || !!onClick}
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: value ? COLORS.textPrimary : COLORS.textSecondary, cursor: onClick ? 'pointer' : 'text' }}
            />
        </div>
        {error && (
            <p className="text-sm mt-1" style={{ color: COLORS.statusPending }}>{error}</p>
        )}
    </div>
);

// Reusable Select Field - Custom Dropdown
const SelectField = ({ label, placeholder, value, onChange, options = [], error }) => {
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
                    style={{ background: COLORS.bgInput, borderColor: error ? COLORS.statusPending : COLORS.borderInput }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex-1 text-sm" style={{ color: value ? COLORS.textPrimary : COLORS.textSecondary }}>
                        {value || placeholder}
                    </span>
                    <DownOutlined style={{ color: COLORS.textSecondary, fontSize: 12, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>

                {error && !isOpen && (
                    <p className="text-sm mt-1" style={{ color: COLORS.statusPending }}>{error}</p>
                )}

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

const STORAGE_KEY = 'ownerVehicleDetails';

const INITIAL_FORM = {
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
};

const readPersistedForm = () => {
    if (typeof window === 'undefined') return INITIAL_FORM;
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return INITIAL_FORM;
        return { ...INITIAL_FORM, ...JSON.parse(raw) };
    } catch {
        return INITIAL_FORM;
    }
};

const OwnerVehicleDetailsPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dateInputRef = useRef(null);
    const monthYearInputRef = useRef(null);

    const [form, setForm] = useState(readPersistedForm);
    const [errors, setErrors] = useState({});

    const set = (key) => (val) => {
        setForm((p) => ({ ...p, [key]: val }));
        if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    };

    // All Indian States and Union Territories
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    // Handle date selection from calendar (dd-mm-yyyy)
    const handleRegistrationDateChange = (e) => {
        const dateValue = e.target.value; // yyyy-mm-dd format from input
        if (dateValue) {
            const [year, month, day] = dateValue.split('-');
            const formattedDate = `${day}-${month}-${year}`;
            set('registrationDate')(formattedDate);
        }
    };

    // Handle month-year selection (mm-yyyy)
    const handleManufacturingYearChange = (e) => {
        const monthValue = e.target.value; // yyyy-mm format from input
        if (monthValue) {
            const [year, month] = monthValue.split('-');
            const formattedMonthYear = `${month}-${year}`;
            set('manufacturingYear')(formattedMonthYear);
        }
    };

    const validate = () => {
        const next = {};
        if (!form.ownerName.trim()) next.ownerName = 'Owner name is required';
        if (!/^\d{10}$/.test(form.mobile.trim())) next.mobile = 'Enter a valid 10-digit mobile';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email';
        if (!form.odometer.trim()) next.odometer = 'Odometer reading is required';
        if (!form.registrationNumber.trim()) next.registrationNumber = 'Registration number is required';
        if (!form.state) next.state = 'Select a state';
        if (!form.registrationDate) next.registrationDate = 'Select registration date';
        if (!form.product) next.product = 'Select a product';
        if (!form.make) next.make = 'Select a make';
        if (!form.model) next.model = 'Select a model';
        if (!form.variant) next.variant = 'Select a variant';
        if (!form.manufacturingYear) next.manufacturingYear = 'Select manufacturing year';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNext = () => {
        if (!validate()) return;

        try {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        } catch {
            /* ignore quota / disabled-storage errors */
        }

        // Persist the chosen product so the camera flow downstream
        // (PhotoCaptureSelectionPage / CameraCapturePage) can pick the
        // matching silhouette + angle guides (car / bike / truck).
        dispatch(setProduct(form.product || null));
        console.log('Owner & Vehicle Details submitted:', form);
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
                    placeholder="Enter owner name"
                    value={form.ownerName}
                    onChange={set('ownerName')}
                    error={errors.ownerName}
                />

                <InputField
                    label="Mobile Number"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={set('mobile')}
                    type="tel"
                    prefix="+91"
                    error={errors.mobile}
                />

                <InputField
                    label="Email ID"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={set('email')}
                    type="email"
                    error={errors.email}
                />

                <InputField
                    label="Odometer Reading ( KM )"
                    placeholder="Enter odometer reading"
                    value={form.odometer}
                    onChange={set('odometer')}
                    type="number"
                    error={errors.odometer}
                />

                <InputField
                    label="Registration Number"
                    placeholder="Enter registration number"
                    value={form.registrationNumber}
                    onChange={set('registrationNumber')}
                    error={errors.registrationNumber}
                />

                <SelectField
                    label="Select State"
                    placeholder="Select state"
                    value={form.state}
                    onChange={set('state')}
                    options={indianStates}
                    error={errors.state}
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textPrimary }}>
                        Registration Date
                    </label>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer"
                        style={{ background: COLORS.bgInput, borderColor: errors.registrationDate ? COLORS.statusPending : COLORS.borderInput }}
                        onClick={() => dateInputRef.current?.showPicker()}
                    >
                        <input
                            ref={dateInputRef}
                            type="date"
                            onChange={handleRegistrationDateChange}
                            className="flex-1 outline-none text-sm bg-transparent cursor-pointer"
                            style={{
                                color: form.registrationDate ? COLORS.textPrimary : COLORS.textSecondary,
                                colorScheme: 'light'
                            }}
                        />
                        <CalendarOutlined style={{ color: COLORS.textSecondary, fontSize: 16 }} />
                    </div>
                    {form.registrationDate && (
                        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
                            Selected: {form.registrationDate}
                        </p>
                    )}
                    {errors.registrationDate && !form.registrationDate && (
                        <p className="text-sm mt-1" style={{ color: COLORS.statusPending }}>{errors.registrationDate}</p>
                    )}
                </div>

                <SelectField
                    label="Select Product"
                    placeholder="Select product"
                    value={form.product}
                    onChange={set('product')}
                    options={['Private Car', 'Two Wheeler', 'Commercial Vehicle', 'Taxi']}
                    error={errors.product}
                />

                <SelectField
                    label="Select Make"
                    placeholder="Select make"
                    value={form.make}
                    onChange={set('make')}
                    options={['Mahindra', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Toyota', 'Ford', 'Kia', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'MG', 'Jeep']}
                    error={errors.make}
                />

                <SelectField
                    label="Select Model"
                    placeholder="Select model"
                    value={form.model}
                    onChange={set('model')}
                    options={['Scorpio-N', 'XUV 700', 'Thar', 'Bolero', 'XUV 300']}
                    error={errors.model}
                />

                <SelectField
                    label="Select Variant"
                    placeholder="Select variant"
                    value={form.variant}
                    onChange={set('variant')}
                    options={['Z2', 'Z4', 'Z6', 'Z8', 'Z8L']}
                    error={errors.variant}
                />

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.textPrimary }}>
                        Select Manufacturing Year
                    </label>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer"
                        style={{ background: COLORS.bgInput, borderColor: errors.manufacturingYear ? COLORS.statusPending : COLORS.borderInput }}
                        onClick={() => monthYearInputRef.current?.showPicker()}
                    >
                        <input
                            ref={monthYearInputRef}
                            type="month"
                            onChange={handleManufacturingYearChange}
                            className="flex-1 outline-none text-sm bg-transparent cursor-pointer"
                            style={{
                                color: form.manufacturingYear ? COLORS.textPrimary : COLORS.textSecondary,
                                colorScheme: 'light'
                            }}
                        />
                        <CalendarOutlined style={{ color: COLORS.textSecondary, fontSize: 16 }} />
                    </div>
                    {form.manufacturingYear && (
                        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
                            Selected: {form.manufacturingYear}
                        </p>
                    )}
                    {errors.manufacturingYear && !form.manufacturingYear && (
                        <p className="text-sm mt-1" style={{ color: COLORS.statusPending }}>{errors.manufacturingYear}</p>
                    )}
                </div>

                <BottomButton label="Submit" onClick={handleNext} />
            </div>
        </div>
    );
};

export default OwnerVehicleDetailsPage;
