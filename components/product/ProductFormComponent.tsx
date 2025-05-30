import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FormInput from './FormInput';
import CategoryPicker from './CategoryPicker';
import ImageUpload from './ImageUpload';
import FormButton from './FormButton';

// Define the structure of your form data
interface ProductFormData {
  title: string;
  category: string | null;
  gender: string;
  brand: string;
  price: string;
  size: string;
  colour: string;
  stock: string;
  sku: string;
  imageUri: string | null;
}

interface ProductFormComponentProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>; // For editing later
}

const categoryOptions = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Books', value: 'books' },
  { label: 'Home Goods', value: 'home_goods' },
  // Add more categories as needed
];

const ProductFormComponent: React.FC<ProductFormComponentProps> = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData.title || '',
    category: initialData.category || null,
    gender: initialData.gender || '',
    brand: initialData.brand || '',
    price: initialData.price || '',
    size: initialData.size || '',
    colour: initialData.colour || '',
    stock: initialData.stock || '',
    sku: initialData.sku || '',
    imageUri: initialData.imageUri || null,
  });

  const handleInputChange = (name: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageSelected = (uri: string | null) => {
    setFormData(prev => ({ ...prev, imageUri: uri }));
  };

  const handleAddVariable = () => {
    console.log('Add Variable pressed');
    // Implement variable logic here
  };

  const handleSubmit = () => {
    // Basic validation (can be expanded with a library like Yup)
    if (!formData.title || !formData.category) {
      console.error('Title and Category are required');
      // Show error to user
      return;
    }
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <ImageUpload 
        onImageSelected={handleImageSelected} 
        initialImageUri={formData.imageUri} 
      />

      <FormInput
        label="Title"
        value={formData.title}
        onChangeText={(text) => handleInputChange('title', text)}
        placeholder="Enter product title"
      />
      <CategoryPicker
        label="Category"
        options={categoryOptions}
        selectedValue={formData.category}
        onValueChange={handleCategoryChange}
        placeholder="Select category"
      />
      <FormInput
        label="Gender"
        value={formData.gender}
        onChangeText={(text) => handleInputChange('gender', text)}
        placeholder="e.g., Men, Women, Unisex"
      />
      <View style={styles.row}>
        <FormInput
          label="Brand"
          value={formData.brand}
          onChangeText={(text) => handleInputChange('brand', text)}
          placeholder="Enter brand"
          containerStyle={styles.halfWidth}
        />
        <FormInput
          label="Price"
          value={formData.price}
          onChangeText={(text) => handleInputChange('price', text)}
          placeholder="0.00"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          label="Size"
          value={formData.size}
          onChangeText={(text) => handleInputChange('size', text)}
          placeholder="e.g., M, L, XL, 10"
          containerStyle={styles.halfWidth}
        />
        <FormInput
          label="Colour"
          value={formData.colour}
          onChangeText={(text) => handleInputChange('colour', text)}
          placeholder="e.g., Red, Blue"
          containerStyle={styles.halfWidth}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          label="Stock"
          value={formData.stock}
          onChangeText={(text) => handleInputChange('stock', text)}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <FormInput
          label="SKU"
          value={formData.sku}
          onChangeText={(text) => handleInputChange('sku', text)}
          placeholder="Stock Keeping Unit"
          containerStyle={styles.halfWidth}
        />
      </View>

      <FormButton title="Add Variable" onPress={handleAddVariable} variant="secondary" />
      <FormButton title="Save" onPress={handleSubmit} variant="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%', // Adjust for desired gap
  },
});

export default ProductFormComponent;
