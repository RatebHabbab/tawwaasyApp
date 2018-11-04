import React, { Component } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { setCart } from '../../utils/misc';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            productIndex: -1,
            cartIndex: -1,
        }
    }

    componentWillMount() {
        this.setState({
            count: this.props.product.count,
            productIndex: global.products.findIndex(element => element.name === this.props.product.name),
            cartIndex: global.cart.indexOf(this.props.product),
        })
    }

    updateCart() {
        this.setState({
            count: this.state.count + 1
        })
        global.products[this.state.productIndex].count++;
        global.cart[this.state.cartIndex].count++;
        this.props.updateOrder();
        setCart(JSON.stringify(global.cart), () => {
            console.log('works')
        })
        setTimeout(() => {
            this.props.updateProducts();
        }, 1);
    }

    decreaseCart() {
        this.setState({
            count: this.state.count - 1
        })
        global.products[this.state.productIndex].count--;
        global.cart[this.state.cartIndex].count--;
        if (global.cart[this.state.cartIndex].count === 0) {
            // global.cart.splice(this.state.cartIndex,1);
            global.cart[this.state.cartIndex].name = "null";
        }
        this.props.updateOrder();
        setCart(JSON.stringify(global.cart), () => {
            console.log('works')
        })
        setTimeout(() => {
            this.props.updateProducts();
        }, 1);
    }

    deleteItemFromCart() {
        Alert.alert(
            'حذف المنتج',
            'هل تريد حذف المنتج من سلة المشتريات؟',
            [
                { text: 'لا', onPress: () => console.log('Cancel Pressed'), style: { fontFamily: 'Tajawal-Bold' } },
                {
                    text: 'نعم', onPress: () => {
                        this.setState({
                            count: 0
                        })
                        global.products[this.state.productIndex].count = 0;
                        global.cart[this.state.cartIndex].count = 0;
                        // global.cart.splice(this.state.cartIndex,1);
                        global.cart[this.state.cartIndex].name = "null";
                        this.props.updateOrder();
                        setCart(JSON.stringify(global.cart), () => {
                            console.log('works')
                        })
                        setTimeout(() => {
                            this.props.updateProducts();
                        }, 1);
                    }
                },
            ],
            { cancelable: false });


    }

    render() {
        return (
            <View style={styles.innerContainerStyle}>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <Text style={styles.textStyle}>{this.props.product.name}</Text>
                    <Text style={{ fontFamily: 'Tajawal-Medium', color: '#4C4C4C', fontSize: 16 }}>عدد: {this.props.product.count}</Text>
                    <Text style={{ fontFamily: 'Tajawal-Medium', color: '#EF5350', fontSize: 16 }}>السعر :{this.props.product.count * this.props.product.price} ل.س</Text>
                    <Button
                        onPress={() => { this.deleteItemFromCart() }}
                        title="حذف"
                        titleStyle={{ fontFamily: 'Tajawal-Bold' }}
                        buttonStyle={{
                            backgroundColor: "#FFCC00",
                            width: 60,
                        }}
                    />
                </View>
                <View style={{ flex: 2 }}>
                    <Image
                        resizeMode={"contain"}
                        style={styles.itemImage}
                        source={{ uri: `http://tawwasy.com/pub/media/catalog/product${this.props.product.custom_attributes[3].value}` }}
                    />
                    <View style={styles.cartPart}>
                        <View style={{ flex: 5 }} />
                        <View style={{ flex: 5 }}>
                            <Text style={styles.priceTag} onPress={() => { this.decreaseCart() }}>
                                -
                            </Text>
                        </View>
                        <View style={{ flex: 5 }}>
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={styles.priceTag} onPress={() => { this.updateCart() }}>
                                +
                            </Text>
                        </View>
                        <View style={{ flex: 5 }} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    innerContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    },
    textStyle: {
        fontFamily: 'Tajawal-Bold',
        color: '#4C4C4C',
        fontSize: 16
    }, itemImage: {
        width: '100%',
        height: 80,
    }, cartPart: {
        width: '100%',
        height: 30,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }, priceTag: {
        lineHeight: 30,
        width: '90%',
        height: '90%',
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: '#EF5450',
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'Tajawal-Bold',
    },
}

export default OrderItem;