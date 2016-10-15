package org.jsbeans.textextractors;

public interface ExtractableAttribute<Container> {
    <ValueType> Class<ValueType> getType();
    <ValueType> ValueType get(Container container);
}
