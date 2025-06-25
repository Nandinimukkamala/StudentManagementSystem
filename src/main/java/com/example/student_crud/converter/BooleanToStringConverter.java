package com.example.student_crud.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BooleanToStringConverter implements AttributeConverter<Boolean, String> {

    @Override
    public String convertToDatabaseColumn(Boolean attribute) {
        return attribute != null && attribute ? "true" : "false"; // Convert boolean to "true"/"false" string
    }

    @Override
    public Boolean convertToEntityAttribute(String dbData) {
        return "true".equalsIgnoreCase(dbData); // Convert "true"/"false" string back to boolean
    }
}
