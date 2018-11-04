//Packages:
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { SearchBar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
//Actions:
import { getCategories, getSubCategories } from '../../Store/actions/categories_actions';
import { gridTwoColumns } from '../../utils/misc';
//Components:
import HorizontalScroll from './horizontal_scroll_icons';
import ProductList from './productList';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            closeToBottom: false,
            isLoading: true,
            categories: [],
            categoriesAsObject: [],
            categoryIds: [],
            products: [],
            categorySelected: {
                name: "الكل",
                id: this.props.categoryId
            },
            isDown: false,
            searchMode: false,
            cartNum: 0,
        }
    }

    updateCartIcon = () => {
        let num = 0;
        global.cart.map(item => {
            num = num + item.count
        })
        this.setState({
            cartNum: num,
        });
    }

    updateProducts = () => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
        this.setState({
            isLoading: true,
            products: []
        });
        let pr = [];
        global.products.map(
            product => {
                if (product.custom_attributes[7].value.includes(this.state.categorySelected.id.toString())) {
                    pr.push(product);
                }
            }
        );
        const newProducts = gridTwoColumns(pr)
        this.setState({
            isLoading: false,
            products: newProducts,
        })
    }

    updateCategoryHandler = (categoryName, categoryId) => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
        this.setState({
            isLoading: true,
            categorySelected: {
                name: categoryName,
                id: categoryId
            },
            products: []
        });
        let pr = [];
        global.products.map(
            product => {
                if (product.custom_attributes[7].value.includes(categoryId.toString())) {
                    pr.push(product);
                }
            }
        );
        const newProducts = gridTwoColumns(pr)
        this.setState({
            isLoading: false,
            products: newProducts,
            categorySelected: {
                name: categoryName,
                id: categoryId
            }
        })
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

    searchProducts = (categoryName, categoryId, key) => {
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
        if (key == "") {
            Actions.refresh({ title: categoryName })
            this.setState({
                isLoading: true,
                ategorySelected: {
                    name: categoryName,
                    id: -1
                },
                products: [],
                searchMode: false
            });
            let pr = [];
            global.products.map(
                product => {
                    if (product.custom_attributes[7].value.includes(this.props.categoryId.toString())) {
                        pr.push(product);
                    }
                }
            );
            const newProducts = gridTwoColumns(pr)
            this.setState({
                isLoading: false,
                products: newProducts
            });
        } else {
            Actions.refresh({ title: 'نتيجة البحث' })
            this.setState({
                isLoading: true,
                categorySelected: {
                    name: categoryName,
                    id: -1
                },
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
                categorySelected: {
                    name: categoryName,
                    id: -1
                }
            })
        }
    }

    componentWillMount() {
        let num = 0;
        global.cart.map(item => {
            num = num + item.count
        });
        this.props.getCategories().then(() => {
            let y =
                this.props.Categories.list.map(
                    category => category.id == this.props.categoryId ? category : null
                );
            let msmsm = y.filter(item => item);
            let names =
                msmsm[0].children_data.map(
                    category => category.name
                )
            names.unshift('الكل')
            const ids =
                msmsm[0].children_data.map(
                    category => category.id
                )
            const newCategories = names.map((x, i) => {
                return {
                    name: x,
                    id: i === 0 ? this.props.categoryId : ids[i - 1]
                }
            })
            this.setState({
                categories: names,
                categoryIds: ids,
                categoriesAsObject: newCategories,
                isLoading: false,
            })
        });
        let pr = [];
        global.products.map(
            product => {
                if (product.custom_attributes[7].value.includes(this.props.categoryId.toString())) {
                    pr.push(product);

                }
            }
        );
        const newProducts = gridTwoColumns(pr)
        this.setState({
            products: newProducts,
            cartNum: num
        })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        Actions.pop();
        return true;
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    render() {
        return (
            <View style={
                StyleSheet.absoluteFill
            }>
                <SearchBar
                    lightTheme
                    clearIcon={{ color: 'white' }}
                    inputStyle={{ textAlign: 'right', fontFamily: 'Tajawal-Regular', fontSize: 20, height: 50 }}
                    onChangeText={(value) => this.searchProducts(this.props.categoryName, this.props.categoryId, value)}
                    placeholder='البحث عن المنتجات..'
                />
                {
                    this.state.searchMode ?
                        null
                        :
                        this.state.isLoading ?
                            <ActivityIndicator color="#EF5450" size="large" />
                            :
                            <HorizontalScroll
                                categories={this.state.categoriesAsObject}
                                categorySelected={this.state.categorySelected}
                                updateCategoryHandler={this.updateCategoryHandler}
                            />
                }
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
                    removeClippedSubviews={true}
                >
                    <View>
                        <View style={styles.articleContainer}>
                            <View
                                style={{ flex: 1 }}
                            >
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
    isLoading: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50
    },
    articleContainer: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
});

function mapStateToProps(state) {
    return {
        Categories: state.Categories,
        Products: state.Products
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getCategories, getSubCategories }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)