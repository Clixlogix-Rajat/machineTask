import React, { useState } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { STORAGE } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

var options = {
  mediaType: 'photo',
};

const CategoryCreationPage = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [engCategory, setEngCategory] = useState('');
  const [hindiCategory, setHindiCategory] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [featured, setFeatured] = useState(null);
  const [items, setItems] = useState([
    { label: 'True', value: true },
    { label: 'False', value: false }
  ]);

  // To Upload image 
  const openGallery = () => {
    launchImageLibrary(options, response => {
      if (response.assets) {
        let fileUri = response.assets[0].uri;
        setImageUri(fileUri);
      }
    });
  };

  //To submit button action to update category list
  const onSubmit = async () => {
    if (engCategory == '') {
      Alert.alert(' Please enter category name (eng)');
    } else if (hindiCategory == '') {
      Alert.alert(' Please enter category name (hindi)');
    } else if (description == '') {
      Alert.alert(' Please enter category description');
    } else if (featured == null) {
      Alert.alert('Please select featured type');
    } else if (!imageUri) {
      Alert.alert('please choose category image');
    } else {
      const newCategory = {
        attributeSet: "0",
        categoryId: "0",
        categoryNumber: 0,
        create_date: null,
        description: description,
        featured: featured,
        icon: null,
        image: imageUri,
        level: 0,
        name: [
          {
            _id: "0",
            language: "en",
            value: engCategory,
          },
          {
            _id: "0",
            language: "en",
            value: hindiCategory,
          }],
        parentID: "0",
        slug: engCategory.toLowerCase(),
        status: true,
        type: 1,
      }
      const storeData = await AsyncStorage.getItem(STORAGE);
      if(storeData){
        const list = JSON.parse(storeData);
        const newList = JSON.stringify([...list, newCategory]);
        AsyncStorage.setItem( STORAGE, newList);
        navigation.navigate('Listing Screen');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoryForm}>
        <TextInput
          style={styles.inputField}
          value={engCategory}
          onChangeText={setEngCategory}
          maxLength={35}
          placeholder='Enter Category name in english'
        />
        <TextInput
          style={styles.inputField}
          value={hindiCategory}
          onChangeText={setHindiCategory}
          maxLength={35}
          placeholder='Enter Category name in hindi'
        />
        <TextInput
          style={styles.inputField}
          value={description}
          onChangeText={setDescription}
          placeholder='Enter category description'
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.uploadBtn} onPress={openGallery} >
            <Text style={styles.uploadText}>Choose Image </Text>
          </TouchableOpacity>
          {
            imageUri ?
              <Image
                style={{ width: "50%", height: 100, marginTop: 10 }}
                resizeMode="contain"
                source={{ uri: imageUri }}
              />
              : null
          }
        </View>
        <DropDownPicker
          style={{ width: "90%", marginTop: 20 }}
          open={open}
          placeholder="Featured"
          dropDownContainerStyle={styles.dropDownStyle}
          
          value={featured}
          items={items}
          setOpen={setOpen}
          setValue={setFeatured}
          setItems={setItems}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: 'center',
  },
  heading: {
    marginTop: 20,
    fontSize: 30,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  categoryForm: {
    alignItems: "flex-start",
    width: '100%',
    paddingLeft: '5%'
  },
  inputField: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "90%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
  },
  uploadBtn: {
    backgroundColor: '#6487E5',
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  uploadText: {
    fontSize: 16,
    color: 'white',
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: '#6487E5',
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    height: 50,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 20,
    color: 'white',
  },
  dropDownStyle: {
    backgroundColor: "#dfdfdf",
    width: "90%", 
    marginTop: 20
  },
});

export default CategoryCreationPage;
