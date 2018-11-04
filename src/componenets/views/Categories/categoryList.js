import React, { Component } from 'react';
import { ListView, View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Image1 from '../../../assets/images/imageloading.gif';
import Image2 from '../../../assets/images/Cheese_Category.jpg';
import Image3 from '../../../assets/images/Spices_Category.jpg';
import Image4 from '../../../assets/images/Drinks_Category.jpg';
import Image5 from '../../../assets/images/Beans_Category_1.jpg';
import Image6 from '../../../assets/images/Sauces_Category.jpg';
import Image7 from '../../../assets/images/CansJars_Category.jpg';
import Image8 from '../../../assets/images/Cleaning_Category.jpg';
import Image9 from '../../../assets/images/Chocolate_Category.jpg';
import Image10 from '../../../assets/images/category1.jpg';

const categoryImage = (value) => {
    let image = Image1;
    switch (value) {
        case 'الأجبان والألبان':
            image = Image2
            break;
        case 'البهارات والبزورية':
            image = Image3
            break;
        case 'المشروبات':
            image = Image4
            break;
        case 'الرز والمعكرونة والبقوليات':
            image = Image5
            break;
        case 'الزيوت والصلصات':
            image = Image6
            break;
        case 'المعلبات والكونسروة':
            image = Image7
            break;
        case 'المنظفات والعناية الشخصية':
            image = Image8
            break;
        case 'الشوكولا والشيبس':
            image = Image9
            break;
        case 'لوازم منزل':
            image = Image10
            break;
        default:
            image = Image1
            break;
    }
    return image;
}

const categoryImageUrl = (value) => {
    let image = ``;
    switch (value) {
        case 'الأجبان والألبان':
            image = `https://tawwasy.com/appimage/category1.jpg?${new Date()}`
            break;
        case 'البهارات والبزورية':
            image = `https://tawwasy.com/appimage/category2.jpg?${new Date()}`
            break;
        case 'المشروبات':
            image = `https://tawwasy.com/appimage/category3.jpg?${new Date()}`
            break;
        case 'الرز والمعكرونة والبقوليات':
            image = `https://tawwasy.com/appimage/category4.jpg?${new Date()}`
            break;
        case 'الزيوت والصلصات':
            image = `https://tawwasy.com/appimage/category5.jpg?${new Date()}`
            break;
        case 'المعلبات والكونسروة':
            image = `https://tawwasy.com/appimage/category6.jpg?${new Date()}`
            break;
        case 'المنظفات والعناية الشخصية':
            image = `https://tawwasy.com/appimage/category7.jpg?${new Date()}`
            break;
        case 'الشوكولا والشيبس':
            image = `https://tawwasy.com/appimage/category8.jpg?${new Date()}`
            break;
        case 'لوازم منزل':
            image = `https://tawwasy.com/appimage/category9.jpg?${new Date()}`
            break;
        default:
            image = `https://tawwasy.com/appimage/category9.jpg?${new Date()}`
            break;
    }
    return image;
}

class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            allProducts: []
        };
    }

    renderRow(category) {
        return (
            <View style={{ position: 'relative' }}>
                <TouchableHighlight
                    onPress={() => Actions.products({ categoryId: category.id, categoryName: category.name, title: category.name, allProducts: this.props.allProducts })}
                >
                    <View>
                        {
                            <Image
                                resizeMode={"cover"}
                                style={styles.articleImage}
                                source={{ uri: categoryImageUrl(category.name) }}
                            />
                        }
                        <Text style={styles.priceTag}>
                            {category.name}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View>
                <ListView
                    enableEmptySections
                    dataSource={this.state.dataSource.cloneWithRows(this.props.categories)}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    articleImage: {
        width: '100%',
        height: 150
    },
    priceTag: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#EF5450',
        padding: 8,
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'Tajawal-Bold',
    },
})

export default CategoryList;