import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';

import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function TimerScreen({ route }) {
  const { BusStopID, BusNo } = route.params;

  const BUSSTOP_URL = `https://arrivelah2.busrouter.sg/?id=${BusStopID}`;
  const [loading, setLoading] = React.useState(true);

  const [ArrivalTime, setArrivalTime] = React.useState("");
  const [ArrivalSeconds, setArrivalSeconds] = React.useState("");

  const [NextArrivalTime, setNextArrivalTime] = React.useState("");
  const [NextArrivalSeconds, setNextArrivalSeconds] = React.useState("");

  function LoadBusStopData() {
    setLoading(true);

    fetch(BUSSTOP_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        const result = responseData.services.filter(bus => bus.no == BusNo.toString());

        var time = new Date(result[0].next.time)
        setArrivalTime(`${time.getHours().toString().padStart(2, "0")} : ${time.getMinutes().toString().padStart(2, "0")} : ${time.getSeconds().toString().padStart(2, "0")}`);
        setArrivalSeconds(Math.ceil(parseInt(result[0].next.duration_ms) / 1000))

        var time = new Date(result[0].next2.time)
        setNextArrivalTime(`${time.getHours().toString().padStart(2, "0")} : ${time.getMinutes().toString().padStart(2, "0")} : ${time.getSeconds().toString().padStart(2, "0")}`);
        setNextArrivalSeconds(Math.ceil(parseInt(result[0].next2.duration_ms) / 1000))
        
        setLoading(false);
      })
  }

  useEffect(() => {
    const Timer = setInterval(LoadBusStopData, 1000);

    // Unmounting
    return () => clearInterval(Timer);
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.TitleText}>Bus No {BusNo} at Stop {BusStopID}</Text>

      <Text style={[styles.TimerLabel, {color: 'red'}]}>Next Bus</Text>
      <Text style={[styles.TimerText, {color: 'red'}]}>{loading ? <ActivityIndicator size="large" color="#0000ff" /> : ArrivalTime + ' (' + ArrivalSeconds + ' sec)'}</Text>

      <Text style={[styles.TimerLabel, {color: 'orange'}]}>Subsequent Bus</Text>
      <Text style={[styles.TimerText, {color: 'orange'}]}>{loading ? <ActivityIndicator size="large" color="#0000ff" /> : NextArrivalTime + ' (' + NextArrivalSeconds + ' sec)'}</Text>

      
      <TouchableOpacity style={styles.button} onPress={() => LoadBusStopData()} >
        <Text style={styles.buttonText}>
          Refresh!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function BusScreen({ navigation }) {
  const [BusStopID, setBusStopID] = React.useState("83139");
  const [BusNo, setBusNo] = React.useState("155");

  return (
    <View style={styles.container}>
      <Text style={styles.TitleText}>Bus Timing App</Text>

      <Text style={styles.LabelText}>Bus Stop Number</Text>
      <TextInput
        style={styles.input}
        onChangeText={setBusStopID}
        value={BusStopID}
      />

      <Text style={styles.LabelText}>Bus Number</Text>
      <TextInput
        style={styles.input}
        onChangeText={setBusNo}
        value={BusNo}
      />

      <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Bus Viewer", {BusStopID: BusStopID, BusNo: BusNo, })}}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </View>
   );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Select Bus Stops" component={BusScreen} />
        <Stack.Screen name="Bus Viewer" component={TimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 20,
    marginBottom: 20,
  },
  LabelText: {
    color: 'black',
    fontSize: 28,
    marginTop: 20,
  },
  input: {
    height: 40,
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  TimerLabel: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 5,
  },
  TimerText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 55,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
  },
});
