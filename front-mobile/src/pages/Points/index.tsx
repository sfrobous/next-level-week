import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import ItemsService from '../../services/ItemsService';
import Item from '../../models/Item';
import PointsService from '../../services/PointsService';
import Point from '../../models/Point';

interface IPointsParams {
  city: string,
  state: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as IPointsParams;
  useEffect(() => {
    ItemsService.getItems().then(response => {
      setItems(response);
    });
  }, []);

  useEffect(() => {
    PointsService.getAll(routeParams.city, routeParams.state, selectedItems.map(x => String(x)).join(',')).then(response => {
      setPoints(response);
    });
}, [selectedItems]);

useEffect(() => {
  async function loadPosition() {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Oooops', 'Precisamos de sua permissão para obter a localização')
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;
    setInitialPosition([latitude, longitude]);
  }
  loadPosition();
}, []);

function handleNavigateBack() {
  navigation.goBack();
}

function handleNavigateToDetail(id: number) {
  navigation.navigate('Detail', { id });
}

function handleSelectItem(id: number) {
  const oldItems = selectedItems;
  let newItems = [];
  if (oldItems.some(x => x == id)) {
    newItems = oldItems.filter(x => x !== id);
  } else {
    newItems = [...oldItems, id];
  }

  setSelectedItems(newItems)
}

return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
        <Icon name="arrow-left" size={20} color="#34cb79" />
      </TouchableOpacity>

      <Text style={styles.title}>Bem Vindo</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

      <View style={styles.mapContainer}>
        {initialPosition[0] !== 0 && (
          <MapView style={styles.map}
            loadingEnabled={initialPosition[0] == 0}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              longitudeDelta: 0.014,
              latitudeDelta: 0.014
            }}>
            {points.map(point => (
              <Marker key={String(point.id)}
                style={styles.mapMarker}
                onPress={() => handleNavigateToDetail(point.id)}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude
                }}>
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage}
                    source={{
                      uri: point.image
                    }} />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
    </View>
    <View style={styles.itemsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => (
          <TouchableOpacity
            key={String(item.id)}
            activeOpacity={0.6}
            style={[
              styles.item,
              selectedItems.includes(item.id) ? styles.selectedItem : {}
            ]}
            onPress={() => handleSelectItem(item.id)}
          >
            <SvgUri width={42} height={42} uri={item.imageUrl} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </SafeAreaView >
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 32
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});



export default Points;