import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ListView, ScrollView, NetInfo, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCategories } from '../../Store/actions/categories_actions';
import { Actions } from 'react-native-router-flux';
import logo from '../../../assets/images/logo.png';
import Image1 from '../../../assets/images/piece-of-cheese.png';
import Image2 from '../../../assets/images/pepper.png';
import Image3 from '../../../assets/images/glass-with-beverage-ice-cubes-and-straw.png';
import Image4 from '../../../assets/images/cocido.png';
import Image5 from '../../../assets/images/olive-oil.png';
import Image6 from '../../../assets/images/jar-of-jam.png';
import Image7 from '../../../assets/images/water-spray.png';
import Image8 from '../../../assets/images/inclined-chocolate-bar.png';
import Image9 from '../../../assets/images/tools.png';
import facebookImage from '../../../assets/images/Facebook-icon.png';

const categoriesIcon = (value) => {
    let name = null;
    switch (value) {
        case 'الأجبان والألبان':
            name = Image1
            break;
        case "البهارات والبزورية":
            name = Image2
            break;
        case 'المشروبات':
            name = Image3
            break;
        case 'الرز والمعكرونة والبقوليات':
            name = Image4
            break;
        case 'الزيوت والصلصات':
            name = Image5
            break;
        case 'المعلبات والكونسروة':
            name = Image6
            break;
        case 'المنظفات والعناية الشخصية':
            name = Image7
            break;
        case 'الشوكولا والشيبس':
            name = Image8
            break;
        case 'لوازم منزل':
            name = Image9
            break;
        default:
            name = Image9
            break;
    }
    return name;
}

class SidedrawerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            categories: []
        }
    }

    componentWillMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.props.getCategories().then(() => {
                    let newCategories =
                        this.props.Categories.list.map(
                            category => {
                                return {
                                    name: category.name,
                                    id: category.id
                                }
                            }
                        );
                    this.setState({
                        categories: newCategories
                    })
                });
            } else {

            }
        })
    }

    renderRow(category) {
        return (
            <Icon.Button
                style={{ justifyContent: "flex-end" }}
                key={category.name}
                color="#717171"
                backgroundColor="#F6F6F6"
                size={16}
                onPress={() => {
                    Actions.products({ categoryId: category.id, categoryName: category.name, title: category.name })
                }}
            >
                <Text style={styles.buttonText}>
                    {category.name}
                </Text>
                <Image
                    style={{
                        tintColor: '#404040',
                        width: 35,
                        height: 35,
                    }}
                    source={categoriesIcon(category.name)}
                />
            </Icon.Button>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Image
                    resizeMode={"contain"}
                    style={{
                        width: '100%',
                        height: 175
                    }}
                    source={logo}
                />
                <View style={styles.buttonContainer}>
                    {
                        this.state.categories.map(category => this.renderRow(category))
                    }
                </View>
                <View style={styles.footerContainer}>
                    <Icon.Button
                        style={{ justifyContent: "flex-end" }}
                        key="facebook"
                        color="#404040"
                        backgroundColor="#404040"
                        size={16}
                        onPress={() => {
                            Linking.openURL(`https://www.facebook.com/Tawwasy.store`)
                        }}
                    >
                        <Text style={styles.footerText}>
                            تابع صفحتنا على الفيسبوك
                        </Text>
                        <Image
                            style={{
                                tintColor: '#717171',
                                width: 35,
                                height: 35,
                            }}
                            source={facebookImage}
                        />
                    </Icon.Button>

                </View>
                <View style={styles.footer2Container}>
                    {/* <Icon.Button
                        style={{ justifyContent: "center" }}
                        key="ejad"
                        color="#F6F6F6"
                        backgroundColor="#F6F6F6"
                        size={8}
                        onPress={() => Linking.openURL(`http://ejad.solutions/`)}
                    >
                        
                    </Icon.Button> */}
                    <Text style={styles.footer2Text} onPress={() => Linking.openURL(`http://ejad.solutions/`)}>
                            Developed by ejad.solutions
                        </Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    buttonContainer: {
        padding: 5,
        marginTop: 10,
    },
    footerContainer: {
        padding: 5,
        marginTop: 10,
        backgroundColor: '#404040',
    },
    footer2Container: {
        alignItems:'center',
        backgroundColor: '#F6F6F6',
    },
    footerText: {
        paddingRight: 15,
        fontFamily: 'Tajawal-Regular',
        fontSize: 16,
        color: '#F6F6F6'
    },
    footer2Text: {
        fontFamily: 'Oswald-Regular',
        fontSize: 14,
        color: '#404040'
    },
    buttonText: {
        paddingRight: 15,
        fontFamily: 'Tajawal-Regular',
        fontSize: 16,
        color: '#404040'
    }
})


function mapStateToProps(state) {
    return {
        Categories: state.Categories
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getCategories }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidedrawerComponent);