import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder image - replace with actual assets
const placeholderImage = require('@/assets/images/icon.png');

interface SubCategory {
  id: string;
  name: string;
  image: any; // Should be ImageSourcePropType
}

interface MainCategory {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const categoriesData: MainCategory[] = [
  {
    id: 'men',
    name: 'Men',
    subCategories: [
      { id: 'men-tshirts', name: 'T-Shirts', image: placeholderImage },
      { id: 'men-shirts', name: 'Shirts', image: placeholderImage },
      { id: 'men-jeans', name: 'Jeans', image: placeholderImage },
      { id: 'men-trousers', name: 'Trousers', image: placeholderImage },
      { id: 'men-ethnic', name: 'Ethnic Wear', image: placeholderImage },
      { id: 'men-footwear', name: 'Footwear', image: placeholderImage },
    ],
  },
  {
    id: 'women',
    name: 'Women',
    subCategories: [
      { id: 'women-tops', name: 'Tops', image: placeholderImage },
      { id: 'women-dresses', name: 'Dresses', image: placeholderImage },
      { id: 'women-jeans', name: 'Jeans', image: placeholderImage },
      { id: 'women-ethnic', name: 'Ethnic Wear', image: placeholderImage },
      { id: 'women-beauty', name: 'Beauty', image: placeholderImage },
      { id: 'women-footwear', name: 'Footwear', image: placeholderImage },
    ],
  },
  {
    id: 'kids',
    name: 'Kids',
    subCategories: [
      { id: 'kids-boys', name: "Boys' Clothing", image: placeholderImage },
      { id: 'kids-girls', name: "Girls' Clothing", image: placeholderImage },
      { id: 'kids-toys', name: 'Toys', image: placeholderImage },
      { id: 'kids-footwear', name: "Kids' Footwear", image: placeholderImage },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    subCategories: [
      { id: 'beauty-makeup', name: 'Makeup', image: placeholderImage },
      { id: 'beauty-skincare', name: 'Skincare', image: placeholderImage },
      { id: 'beauty-haircare', name: 'Haircare', image: placeholderImage },
      { id: 'beauty-fragrance', name: 'Fragrance', image: placeholderImage },
    ],
  },
  {
    id: 'home',
    name: 'Home & Living',
    subCategories: [
      { id: 'home-decor', name: 'Home Decor', image: placeholderImage },
      { id: 'home-furnishing', name: 'Furnishing', image: placeholderImage },
      { id: 'home-kitchen', name: 'Kitchen & Dining', image: placeholderImage },
    ],
  },
];

export default function CategoriesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for categories or products"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {categoriesData.map((mainCategory) => (
          <View key={mainCategory.id} style={styles.mainCategoryContainer}>
            <Text style={styles.mainCategoryTitle}>{mainCategory.name}</Text>
            <View style={styles.subCategoryGrid}>
              {mainCategory.subCategories.map((subCategory) => (
                <TouchableOpacity key={subCategory.id} style={styles.subCategoryItem}>
                  <Image source={subCategory.image} style={styles.subCategoryImage} />
                  <Text style={styles.subCategoryName}>{subCategory.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#111', // Darker shade for header
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#111',
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  mainCategoryContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  mainCategoryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },
  subCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subCategoryItem: {
    width: '31%', // Roughly 3 items per row with some spacing
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1C1C1E', // Card background color
    borderRadius: 8,
    padding: 10,
  },
  subCategoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8, // Slightly rounded corners for the image
    marginBottom: 8,
    backgroundColor: '#333', // Placeholder background for image
  },
  subCategoryName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});
