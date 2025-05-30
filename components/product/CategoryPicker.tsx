import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryPickerProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  pickerStyle?: ViewStyle;
  error?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select category',
  containerStyle,
  labelStyle,
  pickerStyle,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TouchableOpacity
        style={[styles.pickerInput, pickerStyle, error ? styles.inputError : null]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#00C9FF" />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  } as ViewStyle,
  label: {
    fontFamily: 'Baloo',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  } as TextStyle,
  pickerInput: {
    fontFamily: 'Baloo',
    fontSize: 18,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#00C9FF',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  pickerText: {
    fontFamily: 'Baloo',
    fontSize: 18,
    color: '#FFFFFF',
  } as TextStyle,
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    fontFamily: 'Baloo',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxHeight: '50%',
    borderWidth: 1,
    borderColor: '#00C9FF',
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  optionText: {
    fontFamily: 'Baloo',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default CategoryPicker;
