import React, { Component } from 'react';
import { View, Text, ScrollView, ListView, Linking, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import OrderItem from './OrderItem';
import { setCart } from '../../utils/misc';
import { Actions } from 'react-native-router-flux';
//kareem
class checkout extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let x = [];
        global.cart.map(item => {
            if (item.count > 0) {
                x.push(item)
            }
        });
        this.state = {
            dataSource: ds.cloneWithRows(x),
            bill: 0,
            orderCount:0
        };
    }

    getBill() {
        let bill = 0;
        for (let i = 0; i < global.cart.length; i++) {
            bill = bill + (global.cart[i].count * global.cart[i].price);
            console.log(bill)
        }
        return bill;
    }

    getOrderCount() {
        let orderCount = 0;
        for(let i=0; i<global.cart.length; i++){
            if(global.cart[i].count > 0){
                orderCount++;
            }
        }
        return orderCount;
    }

    updateOrder() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let x = [];
        global.cart.map(item => {
            if (item.count > 0) {
                x.push(item)
            }
        });
        global.cart = x ;
        this.setState({
            dataSource: ds.cloneWithRows(x),
            bill: this.getBill(),
            orderCount: this.getOrderCount()
        })
        this.props.updateCartIcon();
    }

    componentWillMount() {
        this.setState({
            bill: this.getBill(),
            orderCount: this.getOrderCount()
        })
    }

    componentDidUpdate(){
        console.log('updated');
        // this.updateOrder();
    }

    sendOrder() {
        let message = "الطلب:\n";

        for(let i=0 ;i < global.cart.length;i++){
            if(global.cart[i].count > 0){
                message = message + global.cart[i].name + '\nعدد: ' + global.cart[i].count + '\nالسعر: ' + global.cart[i].price * global.cart[i].count + ' ل.س\n\n';    
                let x = global.products.findIndex(element => element.name === global.cart[i].name);
                global.products[x].count = 0;
            }
        }

        // global.cart.map(item => {
        //     message = message + item.name + '\nعدد: ' + item.count + '\nالسعر: ' + item.price * item.count + ' ل.س\n\n';
        // })
        message = message + 'المجموع: ' + this.getBill() + ' ل.س';
        // global.cart.map(pr => {
        //     let x = global.products.findIndex(element => element.name === pr.name);
        //     global.products[x].count = 0;
        // })
        const url = `whatsapp://send?text=${message}&phone=+963959444909`;
        Linking.canOpenURL(url).then(
            supported => {
                if (supported) {
                    Alert.alert(
                        'تأكيد الطلب',
                        'سيتم إرسال محتوى سلة المشتريات عبر برنامج الواتس اب',
                        [
                            { text: 'إلغاء', onPress: () => console.log('Cancel Pressed'), style: { fontFamily: 'Tajawal-Bold' } },
                            {
                                text: 'تأكيد', onPress: () => {
                                    Linking.openURL(url);
                                    global.cart = [];
                    setCart(JSON.stringify(global.cart), () => {
                        console.log('works')
                    })
                    Actions.reset( 'home',{ allProducts: global.products });
                                }
                            },
                        ],
                        { cancelable: false });
                    
                } else {
                    Alert.alert(
                        'خطأ في إرسال الطلب',
                        'يرجى التأكد من تنصيب برنامج الواتس اب قبل تأكيد طلب الشراء',
                    )
                }
            }
        );
    }

    renderItem = (item) => {
        return (
            <View style={styles.containerStyle}>
                <OrderItem
                    product={item}
                    updateOrder={this.updateOrder.bind(this)}
                    updateProducts={this.props.updateProducts}
                    cartIndex={this.stat}
                />
            </View>
        );
    }

    render() {
        console.log('cart array: ', global.cart);
        return (
            <View style={StyleSheet.absoluteFill}>
                <ScrollView contentContainerStyle={{ paddingBottom: 70 }}
                    removeClippedSubviews={true}>
                    
                    <ListView
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem.bind(this)}
                    />

                </ScrollView>
                <View style={styles.orderContainerStyle}>
                    <View style={styles.innerContainerStyle}>
                        <View style={{ flex: 2 }}>
                            <Button
                                onPress={() => { this.sendOrder() }}
                                title="إرسال الطلب"
                                titleStyle={{ fontFamily: 'Tajawal-Bold' }}
                                buttonStyle={{
                                    backgroundColor: "#EF5450",
                                    width: 100,
                                }}
                            />
                        </View>
                        <View style={{ flex: 2 }}>
                        <Text style={{ fontFamily: 'Tajawal-Medium', color: '#EF5350', fontSize: 17 }}>عدد المنتجات: {this.state.orderCount}</Text>
                            <Text style={{ fontFamily: 'Tajawal-Bold', fontSize: 20 }}>المجموع: {this.state.bill} ل.س</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {

    orderContainerStyle: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { widht: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
    containerStyle: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { widht: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    },
    innerContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    },
    itemImage: {
        width: '100%',
        height: 80,
    },
    textStyle: {
        fontFamily: 'Tajawal-Bold',
        color: '#4C4C4C',
        fontSize: 16
    },
    viewPriceTag: {
        marginRight: 10,
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#EF5450',
        justifyContent: 'center',
    },
    priceTag: {
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
    priceTag2: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'Tajawal-Bold',
    }, cartPart: {
        width: '100%',
        height: 30,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default checkout;