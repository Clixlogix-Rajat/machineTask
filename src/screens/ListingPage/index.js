import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Platform,
  View,
} from 'react-native';
import { data } from '../../categoryData/TestCategoryData';
import upIcon from '../../assets/icon/up-arrow.png';
import downIcon from '../../assets/icon/down-arrow.png';
import nextIcon from '../../assets/icon/next.png';
import plusIcon from '../../assets/icon/plus.png';
import filterIcon from '../../assets/icon/filter.png';
import defaultIcon from '../../assets/icon/default.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE } from '../../constants';


const ListingPage = () => {

  const navigation = useNavigation();
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [flatlistData, setFlatlistData] = useState([]);
  const [searchFilterList, setSearchFilterList] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // when ever listing screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchLocalData();
    }, [])
  );

  //when category data is updated with new category
  useEffect(() => {
    let mainCategories = [];
    let subCategories = [];
    if (categoryList) {
      categoryList.map((each, index) => {
        if (each.parentID == 0) {
          mainCategories.push(each);
        } else {
          subCategories.push(each);
        }
      });
      subCategories.map((sub) => {
        for (let category of mainCategories) {
          if (category.categoryId === sub.parentID) {
            if (!category.subcategory) {
              category.subcategory = [];
            }
            category.subcategory.push(sub);
          }
        }
      });
      mainCategories.sort((a, b) => {
        if (a.name[0].value < b.name[0].value) { return -1; }
        if (a.name[0].value > b.name[0].value) { return 1; }
        return 0;
      })
      setFilteredData(mainCategories);
      setFlatlistData(mainCategories);

    }
  }, [categoryList])

  //for fetching local data stored
  const fetchLocalData = async () => {
    // AsyncStorage.removeItem(STORAGE);
    const storeData = await AsyncStorage.getItem(STORAGE);
    if (storeData) {
      setCategoryList(JSON.parse(storeData))
    } else {
      AsyncStorage.setItem(STORAGE, JSON.stringify(data));
      setCategoryList(data);
    }
  }

  // search header functionality
  const onSearchCategory = txt => {
    setSearchText(txt);
    if (txt.length > 0) {
      setFilterVisible(true);
      const filteredResult = filteredData.filter((item, index) => { return item.slug.includes(txt.toLowerCase()) });
      setFlatlistData(filteredResult);
      setSearchFilterList(filteredResult);
    } else {
      setFlatlistData(filteredData);
      setFilterVisible(false);
      setSearchFilterList(filteredData);
    }
  }

  //navigating to new category creation screen
  const categoryScreen = () => {
    navigation.navigate('Category Creation Screen');
  }

  //navigating to detail category screen
  const navigateAction = (item, index) => {
    navigation.navigate('Details Screen', { data: item })
  }

  // display category & subcategory screen
  const renderItem = ({ item, index }) => {
    const displaySubCategory = subCategory => subCategory.map((item, index) => {
      return (
        <View key={index} style={styles.subCategoryHeader}>
          <Image
            style={styles.subCategoryImage}
            source={defaultIcon}
          />
          <View>
            <Text style={styles.subCategoryName}>{item.name[0].value}</Text>
            <Text style={styles.subCategoryName}>{item.name[1].value}</Text>
          </View>
        </View>
      )
    })
    const showSubCategories = (item, index) => {
      setDropDownStatus(!dropDownStatus);
      setSelectedIndex(index)
    }
    return (
      <View style={{ alignItems: "center" }}>
        <View style={styles.categoryHeader}>
          <Image
            style={styles.categoryImage}
            source={defaultIcon}
          />
          <View>
            <Text style={styles.categoryName}>{item.name[0].value}</Text>
            <Text style={[styles.categoryName, { fontWeight: "normal", marginTop: 5 }]}>{item.name[1].value}</Text>
          </View>
          {
            item.subcategory ?
              <View style={styles.touchableView}>
                <TouchableOpacity style={styles.dropDown} onPress={() => showSubCategories(item, index)} >
                  <Image style={styles.dropDownImage}
                    resizeMode='contain'
                    source={dropDownStatus && selectedIndex == index ? upIcon : downIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailView} onPress={() => navigateAction(item, index)} >
                  <Image style={styles.dropDownImage}
                    resizeMode='contain'
                    source={nextIcon} />
                </TouchableOpacity>
              </View>
              :
              null
          }
        </View>
        {
          dropDownStatus && selectedIndex == index && item.subcategory ?
            displaySubCategory(item.subcategory)
            : null
        }
      </View>
    );
  };

  // filterng featured and non featured data after search complete
  const filterSearch = () => {
    setFilter(!filter);
    const featuredList = searchFilterList.filter((item, index) => {
      return (item.featured == !filter)
    });
    setFlatlistData(featuredList);
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <TouchableOpacity style={styles.createButton} activeOpacity={0.85} onPress={categoryScreen}>
        <Image style={styles.plusIcon} source={plusIcon} />
      </TouchableOpacity>
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchField}
          value={searchText}
          placeholderTextColor="black"
          onChangeText={onSearchCategory}
          placeholder='Search here'
        />
        {
          filterVisible &&
          <TouchableOpacity onPress={filterSearch} style={styles.filterButton}>
            <Image
              style={styles.filterIcon}
              resizeMode='contain'
              source={filterIcon}
            />
          </TouchableOpacity>
        }

      </View>
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
    backgroundColor: "transparent",
  },
  searchHeader: {
    alignItems: "center",
    width: '100%',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between'
  },
  searchField: {
    marginVertical: 20,
    paddingLeft: 20,
    width: "80%",
    fontSize: 18,
    height: 50,
    backgroundColor: "#E0E1E4",
    borderRadius: 10,
  },
  filterButton: {
    width: '15%',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterIcon: {
    width: 30,
    height: 30,
    tintColor: '#ACADB1',
  },
  createButton: {
    backgroundColor: '#E0E1E4',
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: 'center',
    zIndex: 1,
  },
  plusIcon: {
    width: 30,
    height: 30,
  },
  flatlist: {
    width: "100%",
    marginBottom: Platform.OS == 'android'? 40: 0,
  },
  categoryHeader: {
    flexDirection: "row",
    backgroundColor: 'white',
    height: 60,
    width: '90%',
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  categoryImage: {
    height: 25,
    width: 25
  },
  categoryName: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "left"
  },
  subCategoryHeader: {
    backgroundColor: 'white',
    height: 45,
    borderRadius: 10,
    width: '80%',
    marginBottom: 10,
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  subCategoryImage: {
    height: 20,
    width: 20,
  },
  subCategoryName: {
    marginLeft: 15,
    fontSize: 14,
    textAlign: "left",
  },
  touchableView: {
    flexDirection: 'row',
    marginLeft: 'auto',
    justifyContent: 'space-between',
  },
  dropDown: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  dropDownImage: {
    height: 14,
    width: 14,
  },
  detailView: {
    height: 25,
    width: 25,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default ListingPage;
