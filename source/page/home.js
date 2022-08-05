import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView, Image, Alert, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { getCategoryProduct, getProduct, likeProduct, unlikeProduct } from '../redux/product/actions';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { height, width } from '../lib/utils';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const HomePage = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const fetchData = useSelector(state => state.products);
    const loadCategory = useSelector(state => state.products.load_category);
    const loadProduct = useSelector(state => state.products.load_product);
    const [updateState, setUpdate] = useState(0);
    const [image, setImage] = useState(null);

    useEffect(() => {
        dispatch(getCategoryProduct())
        dispatch(getProduct())
    }, []);

    useEffect(() => {
        if (isFocus) {
            _updateCart()
            _loadImage()
        }
    }, [isFocus]);

    const _updateCart = async () => {
        let cart = await AsyncStorage.getItem('cart')
        if (cart) {
            let count = JSON.parse(cart)
            setUpdate(count.length)
        }
    }

    const _loadImage = async () => {
        let getImage = await AsyncStorage.getItem('imgProfile')
        if (getImage) {
            setImage(getImage)
        }
    }

    const _handleImageLibrary = async () => {
        const result = await launchImageLibrary();
        let img = result.assets[0].uri
        await AsyncStorage.setItem('imgProfile', img)
        setImage(img)
    }

    const _handleEmptyCart = async () => {
        await AsyncStorage.removeItem('cart')
        setUpdate(0)
    }

    const _handleLike = (index) => {
        dispatch(likeProduct(index))
    }

    const _handleUnlike = (index) => {
        dispatch(unlikeProduct(index))
    }

    const _renderHeader = () => {
        return (
            <View style={styles.bgHeader}>
                <View style={styles.containerHeader}>
                    <View style={styles.headerLeft}>
                        {
                            image ?
                                <TouchableOpacity onPress={() => _handleImageLibrary()}>
                                    <Image style={styles.profileImage} source={{ uri: image }} resizeMode='cover' />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => _handleImageLibrary()} style={{ backgroundColor: '#c7c7c7', padding: 15, borderRadius: 80 }}>
                                    <MCIcon color={'#717171'} name={'camera-plus'} size={24} />
                                </TouchableOpacity>

                        }
                    </View>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerText}>Hi, </Text>
                        <Text style={styles.headerText}>Find Your Favourite Items</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={() => _handleEmptyCart()} style={styles.boxIcon}>
                            <MCIcon color={'#2786e4'} name={'cart-outline'} size={24} />
                            <View style={styles.badgeIcon}>
                                <Text style={styles.badgeText}>{updateState}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.boxIcon, { marginHorizontal: 20, paddingHorizontal: 10, padding: 0, flexDirection: 'row', alignItems: 'center' }]}>
                    <Icon color={'#717171'} name={'search'} style={{ marginRight: 10 }} size={24} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search..."
                        placeholderTextColor="#000"
                    />
                </View>
            </View>

        )
    }

    const _renderCategory = (item, index) => {
        return (
            <TouchableOpacity key={index}>
                <View style={styles.categoryItem}>
                    <Image style={styles.categoryImage} source={{ uri: item.image }} />
                </View>
                <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    const _renderNew = (item, index) => {
        return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Detail', { index: index })}>
                <View key={index} style={[styles.boxIcon, styles.boxItem]}>
                    <View style={styles.itemLike}>
                        {
                            !item.like ?
                                <TouchableOpacity onPress={() => _handleLike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart-outline'} size={24} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => _handleUnlike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart'} size={24} />
                                </TouchableOpacity>

                        }
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={styles.itemImage} source={{ uri: item.image }} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Rating
                            showRating={false}
                            imageSize={20}
                            style={{ paddingVertical: 10 }}
                            readonly={true}
                            startingValue={item.rating}
                        />
                        <Text style={styles.itemPrice}>$ {item.price}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const _renderHot = (item, index) => {
        return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Detail', { index: index })}>
                <View key={index} style={[styles.boxIcon, styles.boxItemScroll]}>
                    <View style={styles.itemLike}>
                        {
                            !item.like ?
                                <TouchableOpacity onPress={() => _handleLike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart-outline'} size={24} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => _handleUnlike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart'} size={24} />
                                </TouchableOpacity>

                        }
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={styles.itemImage} source={{ uri: item.image }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={[styles.itemTitle, {textAlign: 'left'}]}>{item.title}</Text>
                            <Rating
                                showRating={false}
                                imageSize={20}
                                style={{ paddingVertical: 10, alignSelf: 'flex-start' }}
                                readonly={true}
                                startingValue={item.rating}
                            />
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={[styles.itemPrice, {textAlign: 'right'}]}>$ {item.price}</Text>
                            <Text style={styles.itemTitle}>( {item.rating_count} Ratings)</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView>
            {_renderHeader()}
            {
                !loadCategory ?
                    fetchData.list_category &&
                    fetchData.list_category.length > 0 &&
                    <ScrollView horizontal={true} style={{ marginVertical: 20, marginLeft: 10 }} showsHorizontalScrollIndicator={false}>
                        {fetchData.list_category.map((val, key) => _renderCategory(val, key))}
                    </ScrollView>
                    :
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
            }
            {
                !loadProduct ?
                    fetchData.list_product &&
                    fetchData.list_product.length > 0 &&
                    <View style={styles.containerNew}>
                        <View style={styles.newTitle}>
                            <View style={styles.titleLeft}>
                                <Text style={styles.titleLeftText}>New Fashion</Text>
                            </View>
                            <View style={styles.titleRight}>
                                <Text style={styles.titleRightText}>View All</Text>
                            </View>
                        </View>
                        <View style={styles.newItem}>
                            {fetchData.list_product.map((val, key) => _renderNew(val, key))}
                        </View>
                    </View>
                    :
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
            }
            {
                !loadProduct ?
                    fetchData.list_product &&
                    fetchData.list_product.length > 0 &&
                    <View style={styles.containerNew}>
                        <View style={styles.newTitle}>
                            <View style={styles.titleLeft}>
                                <Text style={styles.titleLeftText}>Hot Sales</Text>
                            </View>
                            <View style={styles.titleRight}>
                                <Text style={styles.titleRightText}>View All</Text>
                            </View>
                        </View>
                        <ScrollView horizontal={true} style={{ marginVertical: 20, marginLeft: 10 }} showsHorizontalScrollIndicator={false}>
                            {fetchData.list_product.map((val, key) => _renderHot(val, key))}
                        </ScrollView>
                    </View>
                    :
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerHeader: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgHeader: {
        height: height * 0.23,
        backgroundColor: '#B9F5FF',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerLeft: {
        alignItems: 'flex-start',
        width: '20%',
    },
    headerCenter: {
        alignItems: 'flex-start',
        width: '60%',
    },
    headerRight: {
        alignItems: 'flex-end',
        width: '20%'
    },
    boxIcon: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
        shadowOffset: {
            width: 0.15,
            height: 0.15,
        },
        shadowOpacity: 0.075,
        shadowRadius: 5,
        elevation: 3,
    },
    badgeIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
        height: 15,
        width: 15,
    },
    badgeText: {
        backgroundColor: 'red',
        borderRadius: 999,
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
    },
    headerText: {
        color: '#000',
        fontSize: 18
    },
    categoryItem: {
        backgroundColor: '#2786e4',
        padding: 10,
        borderRadius: 80,
        marginHorizontal: 5
    },
    categoryImage: {
        height: 55,
        width: 55
    },
    categoryText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 5,
        color: '#717171'
    },
    containerNew: {
        marginVertical: 5
    },
    newTitle: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    titleLeft: {
        width: '50%',
        alignItems: 'flex-start',
    },
    titleLeftText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    titleRight: {
        width: '50%',
        alignItems: 'flex-end',
    },
    titleRightText: {
        fontSize: 14,
        color: '#e19e05',
        color: '#000'
    },
    newItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    boxItem: {
        width: width * 0.45,
        padding: 10,
        marginHorizontal: 5,
    },
    boxItemScroll: {
        width: width * 0.6,
        padding: 10,
        marginHorizontal: 5,
        marginBottom: 10,
    },
    itemImage: {
        height: 100,
        width: 100,
    },
    itemLike: {
        alignItems: 'flex-end'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: '#000'
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    loading: {
        padding: 20,
        height: height * 0.17,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 100
    }
})

export default HomePage