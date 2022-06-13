import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const DetailsPage = (props) => {
  const [flatlistData, setFlatlistData] = useState([]);

  //To recieve incoming details of category
  useEffect(() => {
    const item = [];
    item.push(props.route.params.data);
    setFlatlistData(item);
  }, [])

  //To display category details
  const renderItem = ({ item, index }) => {
    const displaySubCategory = item.subcategory.map((item, index) => {
      return (
        <View style={styles.subCategoryHeader}>
          <Text style={styles.subCategoryName}>{item.name[0].value}</Text>
          <Text style={[styles.subCategoryName, {fontWeight: 'normal'}]}>({item.name[1].value})</Text>
          <Text style={styles.subCategoryDescription}>{item.description}</Text>
        </View>
      )
    })
    return (
      <View style={{ alignItems: "center" }}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{item.name[0].value}</Text>
          <Text style={[styles.categoryName, {fontWeight: 'normal'}]}>({item.name[1].value})</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
        </View>
        {displaySubCategory}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.flatlist}
        data={flatlistData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    width: "100%",
  },
  categoryHeader: {
    backgroundColor: "white",
    width: '90%',
    marginTop: 10,
    paddingVertical: 20,
    alignSelf: "center",
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  categoryImage: {
    backgroundColor: "transparent",
    height: 30,
    width: 30
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
  },
  categoryDescription: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
  },
  subCategoryHeader: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: '700',
  },
  subCategoryDescription: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default DetailsPage;
