import { useSession } from '@/ctx'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface CategoryItemProps {
  image: any
  title: string
}

const CategoryItem = ({ image, title }: CategoryItemProps) => {
  return (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <Image source={image} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  )
}

export default function HomeScreen() {
  const { session } = useSession()
  const [activeTab, setActiveTab] = React.useState('All')

  // In a real app, these would be actual images from your assets
  const placeholderImage = require('@/assets/images/icon.png')

  const tabs = ['All', 'Men', 'Women', 'Kids']
  
  const categories = [
    { id: 1, title: 'T-shirts', image: placeholderImage },
    { id: 2, title: 'Shirts', image: placeholderImage },
    { id: 3, title: 'Pants & Cargos', image: placeholderImage },
    { id: 4, title: 'Co-ords', image: placeholderImage },
    { id: 5, title: 'Ethnic', image: placeholderImage },
    { id: 6, title: 'Athleisure', image: placeholderImage },
    { id: 7, title: 'Jeans', image: placeholderImage },
    { id: 8, title: 'Sports shoes', image: placeholderImage },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C9FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.headerTitle}>Home </Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </View>
        <Text style={styles.locationText}>Home - 156, 15th Flr, Maker Chamb...</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 70 }} // Add padding for the bottom nav
        showsVerticalScrollIndicator={false}
      >
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              image={category.image}
              title={category.title}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom navigation now handled by Expo Router tabs */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#00C9FF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 15,
    top: 15,
  },
  iconButton: {
    marginLeft: 15,
  },
  searchContainer: {
    backgroundColor: '#00C9FF',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 0, // Don't add margin, we'll add padding to contentContainerStyle instead
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#222',
  },
  activeTab: {
    backgroundColor: '#3070D9',
  },
  tabText: {
    color: 'white',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoryItem: {
    width: '22%',
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  categoryTitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  // Bottom navigation styles removed as we're using Expo Router tabs
})