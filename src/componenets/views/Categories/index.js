import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, Text, View, Button, Image, ScrollView, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { getCategories, getCategoryImage } from '../../Store/actions/categories_actions';
import CategoryList from './categoryList';
import { SearchBar, Icon } from 'react-native-elements';
import ProductList from '../Home/productList';
import { gridTwoColumns } from '../../utils/misc';
import { Actions } from 'react-native-router-flux';

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeToBottom: false,
            categories: [],
            searchMode: false,
            isLoading: true,
            products: [],
            cartNum: 0,
        }
    }

    updateProducts = () => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
        this.setState({
            isLoading: true,
            products: []
        });
        let pr = global.products;
        const newProducts = gridTwoColumns(pr)
        this.setState({
            isLoading: false,
            products: newProducts,
        })
    }

    updateCartIcon = () => {
        let num = 0;
        global.cart.map(item => {
            num = num + item.count
        })
        this.setState({
            cartNum: num
        });
    }

    componentWillMount() {
        let num = 0;
        global.cart.map(item => {
            num = num + item.count
        });
        this.setState({
            cartNum: num
        })
        this.props.getCategories().then(() => {
            let newCategories =
                this.props.Categories.list.map(
                    category => {
                        return {
                            name: category.name,
                            id: category.id,
                        }
                    }
                );

            this.setState({
                categories: newCategories
            })
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    handleBackButtonClick() {
        Alert.alert(
            'إغلاق التطبيق',
            'هل تريد الخروج؟',
            [
                { text: 'لا', onPress: () => console.log('Cancel Pressed'), style: { fontFamily: 'Tajawal-Bold' } },
                { text: 'نعم', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    searchProducts = (key) => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
        if (key == "") {
            Actions.refresh({ title: 'متجر تواصي' })
            this.setState({
                searchMode: false
            });
        } else {
            Actions.refresh({ title: 'نتيجة البحث' })
            this.setState({
                isLoading: true,
                products: [],
                searchMode: true
            });
            let pr = [];
            global.products.map(
                product => {
                    let index = product.name.indexOf(key);
                    if (index !== -1) {
                        if (index === 0) {
                            pr.push(product);
                        }
                    }
                }
            )
            global.products.map(
                product => {
                    let index = product.name.indexOf(key);
                    if (index !== -1) {
                        if (product.name[index - 1] === ' ') {
                            pr.push(product);
                        }
                    }
                }
            )
            global.products.map(
                product => {
                    if (product.name.includes(key) && !pr.includes(product)) {
                        pr.push(product);
                    }
                }
            )
            const newProducts = gridTwoColumns(pr)
            this.setState({
                isLoading: false,
                products: newProducts,
            })
        }

    }

    setDirection = (direction) => {
        if (this.state.isDown && direction === 'up') {
            this.setState({
                isDown: false
            })
        } else if (!this.state.isDown && direction === 'down') {
            this.setState({
                isDown: true
            })
        }
    }

    render() {
        return (
            <View style={StyleSheet.absoluteFill}>
                <SearchBar
                    inputStyle={{ textAlign: 'right', fontFamily: 'Tajawal-Regular', fontSize: 20, height: 50 }}
                    clearIcon={{ color: 'white' }}
                    onChangeText={(value) => this.searchProducts(value)}
                    placeholder='البحث عن المنتجات..'
                />
                {
                    this.state.searchMode ?
                        <View style={[StyleSheet.absoluteFill, { paddingTop: 50 }]}>
                            <ScrollView
                                ref={(c) => { this.scroll = c }}
                                onScroll={({ nativeEvent }) => {
                                    //Direction issues:
                                    let currentOffset = nativeEvent.contentOffset.y;
                                    let direction = currentOffset > this.offset ? 'down' : 'up';
                                    this.offset = currentOffset;
                                    this.setDirection(direction);
                                    //####
                                    if (this.isCloseToBottom(nativeEvent)) {
                                        this.setState({
                                            closeToBottom: true
                                        })
                                    } else {
                                        if (this.state.closeToBottom) {
                                            this.setState({
                                                closeToBottom: false
                                            })
                                        }
                                    }
                                }}
                                scrollEventThrottle={400}
                            >
                                <View>
                                    <View style={styles.articleContainer}>
                                        <View style={{ flex: 1 }}>
                                            {
                                                this.state.isLoading ?
                                                    null
                                                    :
                                                    <ProductList
                                                        products={this.state.products}
                                                        closeToBottom={this.state.closeToBottom}
                                                        updateCartIcon={this.updateCartIcon}
                                                    />
                                            }
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                            <TouchableOpacity
                                style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 30,
                                    position: 'absolute',
                                    bottom: 15,
                                    right: 15,
                                    justifyContent: 'center'
                                }}
                                onPress={() => Actions.checkout({ updateCartIcon: this.updateCartIcon, updateProducts: this.updateProducts })}
                            >
                                <View>
                                    <Icon
                                        style={{
                                            shadowOffset: { width: 1, height: 1, },
                                            shadowColor: 'black',
                                            shadowOpacity: 1.0,
                                        }}
                                        reverse
                                        name='shopping-cart'
                                        type='font-awesome'
                                        color='#FFCC00'
                                        size={29}
                                    />
                                    {
                                        this.state.cartNum > 0 ?
                                            <View
                                                style={{
                                                    height: 20,
                                                    borderRadius: 30,
                                                    width: 20,
                                                    position: "absolute",
                                                    bottom: 50,
                                                    right: 5,
                                                    justifyContent: 'center',
                                                    backgroundColor: '#EF5450',
                                                }}
                                            >
                                                <Text style={{ textAlign: 'center', color: '#fff' }}>{
                                                    this.state.cartNum > 99 ?
                                                        '9+'
                                                        :
                                                        this.state.cartNum
                                                }</Text>
                                            </View>
                                            :
                                            null
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <ScrollView
                            ref={(c) => { this.scroll = c }}
                            removeClippedSubviews={true}
                        >
                            <CategoryList
                                categories={this.state.categories}
                                allProducts={global.products}
                            />
                        </ScrollView>
                }
            </View>
        )
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
        backgroundColor: '#FF6444',
        padding: 10,
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'Tajawal-Bold',
    },
    articleContainer: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

function mapStateToProps(state) {
    return {
        Categories: state.Categories
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getCategories, getCategoryImage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);