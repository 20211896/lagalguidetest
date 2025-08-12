import React from "react";
import Select from 'react-select';
import "./Selectbox.css";

const languageOptions = [
    { value: "korean", label: "korean" },
    { value: "china", label: "china" },
];

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: '40px',
        minHeight: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignSelf: 'stretch',
        border: '1px solid #64748B',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#ccc'
        }
    }),

    valueContainer: (provided) => ({
        ...provided,
        height: '40px',
        paddingLeft: '10px',
        paddingRight: '8px'
    }),

    input: (provided) => ({
        ...provided,
        margin: '0',
        padding: '0'
    }),

    indicatorSeparator: () => ({
        display: 'none',
    }),

    indicatorsContainer: (provided) => ({
        ...provided,
        height: '40px',
        paddingRight: '8px'
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
        padding: '8px'
    }),

    placeholder: (provided) => ({
        ...provided,
        color: '#999'
    }),

    singleValue: (provided) => ({
        ...provided,
        color: '#333'
    }),

    menu: (provided) => ({
        ...provided,
        borderRadius: '10px',
        marginTop: '4px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ccc',
        zIndex: 9999
    }),

    menuList: (provided) => ({
        ...provided,
        padding: '0'
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected 
            ? '#3B82F6' 
            : state.isFocused 
            ? '#F1F5F9' 
            : '#FFFFFF',
        color: state.isSelected ? '#FFFFFF' : '#333',
        cursor: 'pointer',
        padding: '10px 15px'
    })
};

export default function SelectLanguage({
    value,
    onChange,
    placeholder = "사용언어를 선택하세요",
}) {
    const handleChange = (selectedOption) => {
        const event = {
            target: {
                value: selectedOption ? selectedOption.value : ''
            }
        };
        onChange(event);
    };

    const selectedValue = languageOptions.find(option => option.value === value) || null;

    return (
        <Select
            value={selectedValue}
            onChange={handleChange}
            options={languageOptions}
            placeholder={placeholder}
            styles={customStyles}
            isSearchable={false}
            isClearable={false}
            menuPortalTarget={document.body}
            menuPosition="absolute"
        />
    );
}