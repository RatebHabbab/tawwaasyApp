import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import imageLoad from '../../../assets/images/imageloading.gif';
import { setCart } from '../../utils/misc';

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockOneCount: 0,
            blockTwoCount: 0,
            productOneIndex: -1,
            productTwoIndex: -1,
            cartOneIndex: -1,
            cartTwoIndex: -1,
            blockOneImage: '',
            blockTwoImage: '',
            oneLoaded: false,
            secondLoaded: false
        }
    }
    componentWillMount() {
        this.setState({
            blockOneCount: this.props.product.blockOne.count,
            blockTwoCount: this.props.product.blockTwo ? this.props.product.blockTwo.count : 0,
            productOneIndex: global.products.indexOf(this.props.product.blockOne),
            productTwoIndex: this.props.product.blockTwo ? global.products.indexOf(this.props.product.blockTwo) : -1,
            cartOneIndex: this.props.product.blockOne.count > 0 ? global.cart.findIndex(element => element.name === this.props.product.blockOne.name) : -1,
            cartTwoIndex: this.props.product.blockTwo ? this.props.product.blockTwo.count > 0 ? global.cart.findIndex(element => element.name === this.props.product.blockTwo.name) : -1 : -1,
            blockOneImage: this.props.product.blockOne.custom_attributes[3].value,
            blockTwoImage: this.props.product.blockTwo ? this.props.product.blockTwo.custom_attributes[3].value : '',
        })
        if (this.state.blockOneImage != '') {
            Image.prefetch(`http://tawwasy.com/pub/media/catalog/product${this.state.blockOneImage}`);
        }
        if (this.state.blockTwoImage != '') {
            Image.prefetch(`http://tawwasy.com/pub/media/catalog/product${this.state.blockTwoImage}`);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product != this.props.product) {
            this.setState({
                blockOneCount: this.props.product.blockOne.count,
                blockTwoCount: this.props.product.blockTwo ? this.props.product.blockTwo.count : 0,
                productOneIndex: global.products.indexOf(this.props.product.blockOne),
                productTwoIndex: this.props.product.blockTwo ? global.products.indexOf(this.props.product.blockTwo) : -1,
                cartOneIndex: this.props.product.blockOne.count > 0 ? global.cart.findIndex(element => element.name === this.props.product.blockOne.name) : -1,
                cartTwoIndex: this.props.product.blockTwo ? this.props.product.blockTwo.count > 0 ? global.cart.findIndex(element => element.name === this.props.product.blockTwo.name) : -1 : -1,
                blockOneImage: this.props.product.blockOne.custom_attributes[3].value,
                blockTwoImage: this.props.product.blockTwo ? this.props.product.blockTwo.custom_attributes[3].value : '',
            })
        }
    }

    itemText(item) {
        return (
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemTextTitle}>
                    {item.name}
                </Text>
                <Text style={styles.itemTextPrice}>
                    {item.price}  ل.س
                    </Text>
            </View>
        );
    }

    deleteItemFromCart(item) {
        if (this.props.product.blockOne.name == item.name) {
            this.setState({
                blockOneCount: this.state.blockOneCount - 1
            })
            global.products[this.state.productOneIndex].count--;
            global.cart[this.state.cartOneIndex].count--;
            if (global.cart[this.state.cartOneIndex].count === 0) {
                this.setState({
                    cartOneIndex: -1
                });
                global.cart[this.state.cartOneIndex].name = "null";
                // global.cart.splice(this.state.cartOneIndex, 1);
            }
        }
        else {
            this.setState({
                blockTwoCount: this.state.blockTwoCount - 1
            })
            global.products[this.state.productTwoIndex].count--;
            global.cart[this.state.cartTwoIndex].count--;
            if (global.cart[this.state.cartTwoIndex].count === 0) {
                this.setState({
                    cartTwoIndex: -1
                });
                global.cart[this.state.cartTwoIndex].name = "null";
                // global.cart.splice(this.state.cartTwoIndex, 1);
            }
        }
        setCart(JSON.stringify(global.cart), () => {
            console.log('works')
        })
        this.props.updateCartIcon();
        console.log(global.cart)
    }

    updateCart(item) {
        if (this.props.product.blockOne.name == item.name) {
            this.setState({
                blockOneCount: this.state.blockOneCount + 1
            })
            global.products[this.state.productOneIndex].count++;
            if (this.state.cartOneIndex == -1) {
                global.cart = [...global.cart, { ...item, count: 1 }];
                this.setState({
                    cartOneIndex: global.cart.length - 1
                })
            } else {
                global.cart[this.state.cartOneIndex].count++;
            }
        }
        else {
            this.setState({
                blockTwoCount: this.state.blockTwoCount + 1
            })
            global.products[this.state.productTwoIndex].count++;
            if (this.state.cartTwoIndex == -1) {
                global.cart = [...global.cart, { ...item, count: 1 }];
                this.setState({
                    cartTwoIndex: global.cart.length - 1
                })
            } else {
                global.cart[this.state.cartTwoIndex].count++;
            }
        }
        setCart(JSON.stringify(global.cart), () => {
            console.log('works')
        })
        this.props.updateCartIcon();
    }

    itemImage(src, item, count) {
        return (
            <View style={{ backgroundColor: '#ffffff', }}>
                <Image
                    resizeMode={"contain"}
                    style={item.name === this.props.product.blockOne.name ?
                        this.state.oneLoaded ?
                            styles.itemImage
                            :
                            [styles.itemImage, { width: 0, height: 0 }]
                        :

                        this.state.secondLoaded ?
                            styles.itemImage
                            :
                            [styles.itemImage, { width: 0, height: 0 }]
                    }
                    source={{
                        uri: item.name === this.props.product.blockOne.name ?
                            `http://tawwasy.com/pub/media/catalog/product${this.state.blockOneImage}`
                            : `http://tawwasy.com/pub/media/catalog/product${this.state.blockTwoImage}`
                        , cache: 'reload'
                    }}
                    onLoadEnd={() => {
                        item.name === this.props.product.blockOne.name ?
                            this.setState({ oneLoaded: true })
                            :
                            this.setState({ secondLoaded: true })
                    }}
                />
                <Image
                    resizeMode={"contain"}
                    style={item.name === this.props.product.blockOne.name ?
                        !this.state.oneLoaded ?
                            styles.itemImage
                            :
                            [styles.itemImage, { width: 0, height: 0 }]
                        :

                        !this.state.secondLoaded ?
                            styles.itemImage
                            :
                            [styles.itemImage, { width: 0, height: 0 }]
                    }
                    source={imageLoad}
                />
                {
                    count > 0 ?
                        <View style={styles.cartPart}>
                            <View style={{ flex: 5 }} />

                            <View style={{ flex: 5 }}>
                                <Text style={styles.priceTag} onPress={() => { this.deleteItemFromCart(item) }}>
                                    -
                                </Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text style={styles.numberTag}>
                                    {count}
                                </Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text style={styles.priceTag} onPress={() => { this.updateCart(item) }}>
                                    +
                                </Text>
                            </View>

                            <View style={{ flex: 5 }} />
                        </View>
                        :
                        <View style={styles.cartPart}>
                            <View>
                                <Button
                                    title="أضف للسلة"
                                    titleStyle={{ fontFamily: 'Tajawal-Regular', fontSize: 15 }}
                                    buttonStyle={{
                                        backgroundColor: "#EF5450",
                                        width: 110,
                                    }}
                                    onPress={() => { this.updateCart(item) }}
                                />
                            </View>
                        </View>
                }
            </View>
        );
    }

    block(item) {
        return (
            <View style={styles.blockRow}>
                <View
                    style={{ flex: 2 }}
                >
                    <View
                        style={[
                            styles.blockGridStyle,
                            styles.blockGridStyleLeft
                        ]}
                    >
                        {this.itemImage(this.state.blockOneImage, item.blockOne, this.state.blockOneCount)}
                        {this.itemText(item.blockOne)}
                    </View>
                </View>
                {
                    item.blockTwo ?
                        <View
                            style={{ flex: 2 }}
                        >
                            <View
                                style={[
                                    styles.blockGridStyle,
                                    styles.blockGridStyleRight
                                ]}
                            >
                                {this.itemImage(this.state.blockTwoImage, item.blockTwo, this.state.blockTwoCount)}
                                {this.itemText(item.blockTwo)}
                            </View>
                        </View>
                        : null
                }

            </View>
        );
    }

    render() {
        return (
            <View>
                {this.block(this.props.product)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    blockRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    itemImage: {
        width: '100%',
        height: 175,
    },
    itemTextContainer: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#EF5350',
        borderTopWidth: 2,
        borderTopColor: '#f6f6f6',
    },
    itemTextTitle: {
        height: 40,
        fontFamily: 'Tajawal-Bold',
        color: '#4C4C4C',
        textAlign: "center",
        marginBottom: 5
    },
    itemTextPrice: {
        fontFamily: 'Tajawal-Bold',
        fontSize: 18,
        color: '#EF5350',
        textAlign: "center",
        marginBottom: 5
    },
    blockGridStyle: {
        backgroundColor: '#ffffff' // f1f1f1
    },
    blockGridStyleLeft: {
        marginRight: 5,
    },
    blockGridStyleRight: {
        marginLeft: 5,
    },
    cartPart: {
        width: '100%',
        height: 30,
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
    , priceTag: {
        lineHeight: 30,
        width: '90%',
        height: '90%',
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: '#EF5450',
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'Tajawal-Bold',
    }
    , numberTag: {
        lineHeight: 28,
        width: '90%',
        height: '90%',
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: '#FFF',
        color: '#EF5450',
        fontSize: 22,
        fontFamily: 'Tajawal-Medium',
    },
    priceTag2: {
        width: 30,
        height: 30,
        textAlign: 'center',
        left: 40,
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        backgroundColor: '#EF5450',
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'Tajawal-Bold',
    },

})


export default ProductItem;