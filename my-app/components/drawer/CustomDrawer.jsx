import { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { UserView } from "..";
import { AuthContext } from "../../context/AuthContext";
// import { BlurView } from "@react-native-community/blur";

const CustomDrawer = (props) => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  return (
    // <View>
    // {/* <BlurView
    //   style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
    //   blurType="light"
    //   blurAmount={10}
    //   reducedTransparencyFallbackColor="white"
    // /> */}
    <View style={{ flex: 1 }}>
      <UserView />
      <DrawerContentScrollView>
        <DrawerItemList {...props} drawerActiveTintColor={COLORS.primary} />
      </DrawerContentScrollView>
      <DrawerItem
        label="odjava"
        icon={({ size, color }) => (
          <FontAwesome name="sign-out" size={size} color={color} />
        )}
        activeTintColor={COLORS.primary}
        inactiveTintColor={COLORS.primary}
        onPress={logout}
      />
    </View>
    // </View>
  );
};

export default CustomDrawer;
