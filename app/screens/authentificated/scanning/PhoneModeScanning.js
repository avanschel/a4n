import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ScanningFormScreen from "./ScanningFormScreen";

export default function PhoneScan(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [codeBar, setCodeBar] = useState(false);
    let lastScanAction=Date.now();
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        let time = Date.now();
        if(lastScanAction === null || time-lastScanAction > 3000){
            lastScanAction = time;
        setScanned(true);
        setCodeBar(data);
        props.onChange(data);

        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if(props.show){
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',position:'relative',zIndex:600,backgroundColor:'#000'
            }}>
            <BarCodeScanner
                ratio={'16:9'}
                onBarCodeScanned={handleBarCodeScanned}
                style={[styles.container]}
            />
            <ScanningFormScreen show={true} codeBar={codeBar} press={(value) => props.press(value)}/>
        </View>
    );

    }else{
        return false
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',zIndex:0
    },
    qr: {
        marginTop: '20%',
        marginBottom: '20%',
        width: 360,
        height: 250,
    }
});