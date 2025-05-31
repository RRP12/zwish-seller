import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FormInput from './FormInput';
import CategoryPicker from './CategoryPicker';
import MediaUpload from './MediaUpload';
import FormButton from './FormButton';

// Define the structure of your form data
export interface ProductFormData { // Exporting for potential use elsewhere
  title: string;
  description: string;
  type: string | null;
  category: string | null;
  brand: string;
  gender: string | null;
  videoUri: string | null; // Renamed from imageUri
  // Variant fields - assuming single variant for now
  mrp: string;
  variantPrice: string;
  variantColor: string;
  variantSize: string;
  variantSku: string;
  variantQuantity: string;
}

interface ProductFormComponentProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>; // For editing later
}

const typeOptions = [
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Footwear', value: 'Footwear' },
];

const categoryOptions = [
  // Clothing - Male
  { label: 'T-shirts', value: 'T-shirts' },
  { label: 'Shirts', value: 'Shirts' },
  { label: 'Pants & Cargos', value: 'Pants & Cargos' },
  { label: 'Jeans', value: 'Jeans' },
  // Clothing - Female
  { label: 'Tops', value: 'Tops' },
  { label: 'Dresses', value: 'Dresses' },
  // Footwear - Male
  { label: 'Casual Shoes', value: 'Casual Shoes' },
  // Footwear - Female
  { label: 'Heels & Sandals', value: 'Heels & Sandals' },
  // Add ALL categories from API docs here
];

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Unisex', value: 'Unisex' },
];

const sizeOptions = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
  { label: 'XXL', value: 'XXL' },
  { label: 'Free Size', value: 'Free Size' },
  // Add numeric sizes or other specific sizes if needed
  // e.g., { label: 'US 7', value: 'US 7' }, { label: 'UK 8', value: 'UK 8' }
];

const ProductFormComponent: React.FC<ProductFormComponentProps> = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type || null,
    category: initialData.category || null,
    brand: initialData.brand || '',
    gender: initialData.gender || null,
    videoUri: initialData.videoUri || null,
    mrp: initialData.mrp || '',
    variantPrice: initialData.variantPrice || '',
    variantColor: initialData.variantColor || '',
    variantSize: initialData.variantSize || '',
    variantSku: initialData.variantSku || '',
    variantQuantity: initialData.variantQuantity || '',
  });

  const handleInputChange = (name: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePickerChange = (name: keyof ProductFormData, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaSelected = (uri: string | null, mediaType: 'image' | 'video') => {
    console.log(`Media selected: URI - ${uri}, Type - ${mediaType}`);
    setFormData(prevData => ({
      ...prevData,
      videoUri: uri, // This now stores either image or video URI
    }));
  };

  const handleAddVariable = () => {
    console.log('Add Variable pressed');
    // Implement variable logic here
  };

  const handleSubmit = async () => {
    // Basic validation (can be expanded with a library like Yup)
    if (!formData.title || !formData.type || !formData.category || !formData.gender || !formData.variantPrice || !formData.variantQuantity) {
      console.error('Required fields are missing. Please fill out Title, Type, Category, Gender, Price, and Quantity.');
      // Show error to user via Alert
      return;
    }

    // TODO: Implement actual video and thumbnail upload to a cloud service here.
    // For now, we'll use placeholders or local URIs.
    const uploadedVideoUrl = formData.videoUri; // Placeholder
    const uploadedThumbnailUrl = formData.videoUri ? `thumb_${formData.videoUri}` : null; // Placeholder

    // TODO: Get shop_id and auth headers from appropriate context/service
    const shopId = 123; // Placeholder - Replace with actual shop_id
    const userInfoHeader = 'user-info-placeholder'; // Placeholder
    const authToken = 'auth-token-placeholder'; // Placeholder

    const apiRequestBody = {
      shop_id: shopId,
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      category: formData.category,
      brand: formData.brand || null,
      gender: formData.gender,
      thumbnail_url: uploadedThumbnailUrl,
      video_url: uploadedVideoUrl,
      variants: [
        {
          mrp: formData.mrp ? parseFloat(formData.mrp) : null,
          price: parseFloat(formData.variantPrice), // Assuming price is required and numeric
          color: formData.variantColor || null,
          size: formData.variantSize || null,
          sku: formData.variantSku || null,
          quantity: parseInt(formData.variantQuantity, 10), // Assuming quantity is required and integer
        },
      ],
    };

    console.log('Submitting to API endpoint:', 'https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/seller/v1/products');
    console.log('API Request Body:', JSON.stringify(apiRequestBody, null, 2));
    console.log('API Headers (placeholders):', {
        'X-Apigateway-Api-Userinfo': userInfoHeader,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    });

    // onSubmit(formData); // Keep this if add-reel.tsx uses it for something else, or remove
    // Actual API call will go here
    /*
    try {
      const response = await fetch('https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/seller/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Apigateway-Api-Userinfo': userInfoHeader, // Replace with actual header value
          'Authorization': `Bearer ${authToken}`, // Replace with actual token
        },
        body: JSON.stringify(apiRequestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Product created successfully:', responseData);
        // Handle success (e.g., show success message, navigate)
      } else {
        console.error('API Error:', responseData);
        // Handle error (e.g., show error message from responseData.message or responseData.errors)
      }
    } catch (error) {
      console.error('Network or other error:', error);
      // Handle network error
    }
    */
  };

  return (
    <View style={styles.container}>
      <MediaUpload 
        onMediaSelected={handleMediaSelected} 
        initialImageUri={formData.videoUri} 
      />

      <FormInput
        label="Title *"
        value={formData.title}
        onChangeText={(text) => handleInputChange('title', text)}
        placeholder="Enter product title"
      />
      <FormInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
        placeholder="Enter product description"
        multiline
        numberOfLines={3}
        inputStyle={{ height: 80, textAlignVertical: 'top' }} // Basic multiline style
      />
      <CategoryPicker
        label="Type *"
        options={typeOptions}
        selectedValue={formData.type}
        onValueChange={(value) => handlePickerChange('type', value)}
        placeholder="Select product type"
      />
      <CategoryPicker
        label="Category *"
        options={categoryOptions}
        selectedValue={formData.category}
        onValueChange={(value) => handlePickerChange('category', value)}
        placeholder="Select category"
      />
      <CategoryPicker
        label="Gender *"
        options={genderOptions}
        selectedValue={formData.gender}
        onValueChange={(value) => handlePickerChange('gender', value)}
        placeholder="Select gender"
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
          label="MRP"
          value={formData.mrp}
          onChangeText={(text) => handleInputChange('mrp', text)}
          placeholder="0.00"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          label="Selling Price *"
          value={formData.variantPrice}
          onChangeText={(text) => handleInputChange('variantPrice', text)}
          placeholder="0.00"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <FormInput
          label="Colour"
          value={formData.variantColor}
          onChangeText={(text) => handleInputChange('variantColor', text)}
          placeholder="e.g., Red, Blue"
          containerStyle={styles.halfWidth}
        />
      </View>
      <View style={styles.row}>
        <CategoryPicker
          label="Size"
          options={sizeOptions}
          selectedValue={formData.variantSize}
          onValueChange={(value) => handlePickerChange('variantSize', value)}
          placeholder="Select size"
          containerStyle={styles.halfWidth}
        />
        <FormInput
          label="Quantity *"
          value={formData.variantQuantity}
          onChangeText={(text) => handleInputChange('variantQuantity', text)}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          label="SKU"
          value={formData.variantSku}
          onChangeText={(text) => handleInputChange('variantSku', text)}
          placeholder="e.g., ABC-123"
          containerStyle={styles.halfWidth}
        />
        <View style={styles.halfWidth} />
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
