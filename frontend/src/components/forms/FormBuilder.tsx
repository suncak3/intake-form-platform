import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateFormData, Gender, ProgrammingLanguage } from '../../types';
import { apiService } from '../../services/api';


const schema = yup.object().shape({
    first_name: yup.string().required('Имя обязательно').max(50, 'Максимум 50 символов'),
    last_name: yup.string().required('Фамилия обязательна').max(50, 'Максимум 50 символов'),
    middle_name: yup.string(),
    iin: yup
        .string()
        .required('ИИН обязателен')
        .matches(/^\d{12}$/, 'ИИН должен содержать 12 цифр')
        .test('not-same-digits', 'ИИН не может состоять из одинаковых цифр', (value) => {
            if (!value) return false;
            return !/^(\d)\1{11}$/.test(value);
        }),
    gender_id: yup.string().required('Пол обязателен'),
    birth_date: yup.string().required('Дата рождения обязательна'),
    phone: yup
        .string()
        .required('Телефон обязателен')
        .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
    programming_language_id: yup.string(),
    custom_programming_language: yup.string(),
});

interface FormBuilderProps {
    onSubmit: (data: CreateFormData) => Promise<void>;
    initialData?: Partial<CreateFormData>;
    submitText?: string;
    isLoading?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
                                                     onSubmit,
                                                     initialData,
                                                     submitText = 'Создать анкету',
                                                     isLoading = false,
                                                 }) => {
    const [genders, setGenders] = useState<Gender[]>([]);
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
    const [showCustomLanguage, setShowCustomLanguage] = useState(false);
    const [isLoadingDictionaries, setIsLoadingDictionaries] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: initialData?.first_name || '',
            last_name: initialData?.last_name || '',
            middle_name: initialData?.middle_name || '',
            iin: initialData?.iin || '',
            gender_id: initialData?.gender_id?.toString() || '',
            birth_date: initialData?.birth_date || '',
            phone: initialData?.phone || '+7 (',
            programming_language_id: initialData?.programming_language_id?.toString() || '',
            custom_programming_language: initialData?.custom_programming_language || '',
        },
    });

    const watchLanguageId = watch('programming_language_id');

    useEffect(() => {
        const loadDictionaries = async () => {
            try {
                const [gendersResponse, languagesResponse] = await Promise.all([
                    apiService.getGenders(),
                    apiService.getProgrammingLanguages(),
                ]);

                setGenders(gendersResponse.genders);
                setLanguages(languagesResponse.programming_languages);
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
            } finally {
                setIsLoadingDictionaries(false);
            }
        };

        loadDictionaries();
    }, []);

    useEffect(() => {
        if (watchLanguageId) {
            setShowCustomLanguage(false);
            setValue('custom_programming_language', '');
        }
    }, [watchLanguageId, setValue]);

    const formatPhone = (value: string) => {
        const phoneNumber = value.replace(/\D/g, '');
        const match = phoneNumber.match(/^7?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);

        if (!match) return value;

        const [, area, first, second, third] = match;

        let formatted = '+7';
        if (area) formatted += ` (${area}`;
        if (first) formatted += `) ${first}`;
        if (second) formatted += `-${second}`;
        if (third) formatted += `-${third}`;

        return formatted.length > 4 ? formatted : '+7 (';
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setValue('phone', formatted);
    };

    const handleCustomLanguageToggle = () => {
        setShowCustomLanguage(!showCustomLanguage);
        if (!showCustomLanguage) {
            setValue('programming_language_id', '');
        } else {
            setValue('custom_programming_language', '');
        }
    };

    const onSubmitForm = async (data: any) => {
        console.log('Данные формы:', data);

        const formData: CreateFormData = {
            first_name: data.first_name,
            last_name: data.last_name,
            middle_name: data.middle_name || undefined,
            iin: data.iin,
            gender_id: parseInt(data.gender_id),
            birth_date: data.birth_date,
            phone: data.phone,
            programming_language_id: data.programming_language_id ? parseInt(data.programming_language_id) : undefined,
            custom_programming_language: data.custom_programming_language || undefined,
        };

        console.log('Отправляемые данные:', formData);
        await onSubmit(formData);
    };

    if (isLoadingDictionaries) {
        return (
            <div className="container text-center" style={{ padding: '2rem' }}>
                <h3>Загрузка формы...</h3>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="form" style={{ maxWidth: '600px' }}>
            <div className="form-group">
                <label htmlFor="first_name" className="form-label">Имя *</label>
                <input
                    id="first_name"
                    type="text"
                    className="form-input"
                    {...register('first_name')}
                    placeholder="Введите имя"
                />
                {errors.first_name && <div className="form-error">{errors.first_name.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="last_name" className="form-label">Фамилия *</label>
                <input
                    id="last_name"
                    type="text"
                    className="form-input"
                    {...register('last_name')}
                    placeholder="Введите фамилию"
                />
                {errors.last_name && <div className="form-error">{errors.last_name.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="middle_name" className="form-label">Отчество</label>
                <input
                    id="middle_name"
                    type="text"
                    className="form-input"
                    {...register('middle_name')}
                    placeholder="Введите отчество (необязательно)"
                />
                {errors.middle_name && <div className="form-error">{errors.middle_name.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="iin" className="form-label">ИИН *</label>
                <input
                    id="iin"
                    type="text"
                    className="form-input"
                    {...register('iin')}
                    placeholder="12 цифр"
                    maxLength={12}
                />
                {errors.iin && <div className="form-error">{errors.iin.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="gender_id" className="form-label">Пол *</label>
                <select
                    id="gender_id"
                    className="form-select"
                    {...register('gender_id')}
                >
                    <option value="">Выберите пол</option>
                    {genders.map((gender) => (
                        <option key={gender.id} value={gender.id.toString()}>
                            {gender.name}
                        </option>
                    ))}
                </select>
                {errors.gender_id && <div className="form-error">{errors.gender_id.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="birth_date" className="form-label">Дата рождения *</label>
                <input
                    id="birth_date"
                    type="date"
                    className="form-input"
                    {...register('birth_date')}
                    max={new Date().toISOString().split('T')[0]}
                />
                {errors.birth_date && <div className="form-error">{errors.birth_date.message}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="phone" className="form-label">Телефон *</label>
                <input
                    id="phone"
                    type="text"
                    className="form-input"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                />
                {errors.phone && <div className="form-error">{errors.phone.message}</div>}
            </div>

            <div className="form-group">
                <label className="form-label">Любимый язык программирования</label>

                {!showCustomLanguage ? (
                    <>
                        <select
                            className="form-select"
                            {...register('programming_language_id')}
                        >
                            <option value="">Выберите язык из списка</option>
                            {languages.map((lang) => (
                                <option key={lang.id} value={lang.id.toString()}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleCustomLanguageToggle}
                            className="btn btn-secondary mt-2"
                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            Указать свой вариант
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            className="form-input"
                            {...register('custom_programming_language')}
                            placeholder="Введите название языка"
                        />
                        <button
                            type="button"
                            onClick={handleCustomLanguageToggle}
                            className="btn btn-secondary mt-2"
                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            Выбрать из списка
                        </button>
                    </>
                )}

                {errors.custom_programming_language && (
                    <div className="form-error">{errors.custom_programming_language.message}</div>
                )}
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isLoading}
            >
                {isLoading ? 'Сохранение...' : submitText}
            </button>
        </form>
    );
};

export default FormBuilder;