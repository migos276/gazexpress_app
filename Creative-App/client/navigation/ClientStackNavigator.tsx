import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClientHomeScreen from "@/screens/client/ClientHomeScreen";
import BouteilleDetailScreen from "@/screens/client/BouteilleDetailScreen";
import SelectAddressScreen from "@/screens/client/SelectAddressScreen";
import CheckoutScreen from "@/screens/client/CheckoutScreen";
import OrderSuccessScreen from "@/screens/client/OrderSuccessScreen";
import OrderDetailScreen from "@/screens/client/OrderDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Bouteille, Commande } from "@/types";

export type ClientStackParamList = {
  ClientHome: undefined;
  BouteilleDetail: { bouteille: Bouteille };
  Cart: undefined;
  SelectAddress: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
  Orders: undefined;
  OrderDetail: { order: Commande };
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

export default function ClientStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BouteilleDetail"
        component={BouteilleDetailScreen}
        options={{ headerTitle: "Details" }}
      />
      <Stack.Screen
        name="SelectAddress"
        component={SelectAddressScreen}
        options={{ headerTitle: "Adresse de livraison" }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerTitle: "Paiement" }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ headerTitle: "Commande" }}
      />
    </Stack.Navigator>
  );
}
