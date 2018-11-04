import React, { Component } from 'react';
import { ListView, View, Text, ActivityIndicator } from 'react-native';
import ProductItem from './productItem';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            renderSecondPart: false,
            indexToRender: 0,
            isEnd: false
        };
    }

    componentWillMount() {
        if (this.props.products.length < 2) {
            this.setState({
                isEnd: true
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.closeToBottom !== this.props.closeToBottom) {
            if (this.props.closeToBottom) {
                this.setState({
                    renderSecondPart: true,
                    indexToRender: this.state.indexToRender + 1,
                    isEnd: false
                })
                if (prevProps.products.length !== 0 && (this.state.indexToRender + 1) * 5 >= this.props.products.length) {
                    this.setState({
                        isEnd: true
                    })
                }
            }
        }
        if (prevProps.products !== this.props.products) {
            this.setState({
                isEnd: false,
                indexToRender: 0
            })
            if (this.props.products.length < 2) {
                this.setState({
                    isEnd: true
                })
            }
        }
    }

    renderRow(product) {
        return <ProductItem
            product={product}
            updateCartIcon={this.props.updateCartIcon}
        />;
    }

    render() {
        let arr = [];
        for (let i = 0; i <= Math.floor(this.props.products.length / 5); i++) {

            if (i === Math.floor(this.props.products.length / 5))
                arr[i] = this.state.dataSource.cloneWithRows(this.props.products.slice(5 * i, this.props.products.length));
            else {
                arr[i] = this.state.dataSource.cloneWithRows(this.props.products.slice(5 * i, 5 * (i + 1)));
            }
        }
        let lists = [];
        for (let i = 0; i <= this.state.indexToRender; i++) {
            if (typeof arr[i] != 'undefined') {
                lists.push(
                    <ListView
                        key={i}
                        enableEmptySections
                        dataSource={arr[i]}
                        renderRow={this.renderRow.bind(this)}
                    />
                )
            }
        }
        return (
            <View>
                {
                    this.props.products.length == 0 ?
                        <Text style={{
                            fontFamily: 'Tajawal-Bold', fontSize: 30,
                            textAlign: 'center'
                        }}>لايوجد نتائج</Text>
                        :
                        lists
                }
                {
                    !this.state.isEnd && this.props.products.length !== 0 ?
                        <ActivityIndicator color="#EF5450" size="large" />
                        : null
                }
            </View>

        );
    }

}

export default ProductList;