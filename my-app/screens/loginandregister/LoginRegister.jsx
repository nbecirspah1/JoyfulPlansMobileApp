import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LottieView from "lottie-react-native";
import animationData from "../../assets/animations/animation14.json";
import { AnimatedTyping } from "../../components";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChalkboardTeacher,
  faChild,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import styles from "./loginregister.style";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnUI,
} from "react-native-reanimated";
import { COLORS, SIZES, images } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import { IsParentContext } from "./IsParentContext";
export default function LoginRegister() {
  library.add(faChalkboardTeacher);
  library.add(faChild);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [childCode, setChildCode] = useState(null);
  const { isLoading, login, userInfo, loginChild } = useContext(AuthContext);
  const { isParent, setIsParent } = useContext(IsParentContext);
  let [greetingCompleted, setGreetingCompleted] = useState(false);
  const { height, width } = Dimensions.get("window");
  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);
  // const [isParent, setIsParent] = useState(false);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      imagePosition.value,
      [0, 1],
      [-height / 3.5, 0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });

  const FormAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const FormButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const loginHandler = () => {
    // runOnUI(() => {
    imagePosition.value = 0;
    setIsParent(false);
    // })();
  };

  const registerHandler = () => {
    // runOnUI(() => {
    imagePosition.value = 0;
    setIsParent(true);
    // })();
  };

  const handleChangeText = (text) => {
    // Remove any non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, "");
    setChildCode(numericValue);
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginBottom: 80,
          }}
        >
          <AnimatedTyping
            text={["Joyful Plans"]}
            onComplete={() => setGreetingCompleted(true)}
          />
          <LottieView
            source={animationData}
            autoPlay
            loop
            // style={{ width: 200, height: 200 }} // Adjust the width and height as needed
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.closeButtonContainer, closeButtonContainerStyle]}
      >
        <Text
          onPress={() => {
            Keyboard.dismiss();
            imagePosition.value = 1;
          }}
          style={{ color: "#FFFFFF" }}
        >
          X
        </Text>
      </Animated.View>
      <View style={styles.bottomContainer}>
        <Animated.View style={buttonsAnimatedStyle}>
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: 400,
              fontSize: 15,
              marginLeft: 30,
              // alignSelf: "stretch",
            }}
          >
            Prijavite se kao:
          </Text>
          <Pressable style={styles.button} onPress={loginHandler}>
            <View style={styles.buttonContainer}>
              {/* <FontAwesome name="child" size={20} color="white" /> */}
              <FontAwesomeIcon icon={faChild} size={20} color="white" />
              <Text style={styles.buttonText}>DIJETE</Text>
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View style={buttonsAnimatedStyle}>
          <Pressable style={styles.button} onPress={registerHandler}>
            <View style={styles.buttonContainer}>
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                size={20}
                color="white"
              />
              <Text style={styles.buttonText}>RODITELJ</Text>
            </View>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.formInputContainer, FormAnimatedStyle]}>
          {isParent && (
            <React.Fragment>
              <TextInput
                placeholder="Unesite Email"
                placeholderTextColor="black"
                style={styles.textInput}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
              <TextInput
                secureTextEntry={true}
                placeholder="Unesite šifru"
                placeholderTextColor="black"
                style={styles.textInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
            </React.Fragment>
          )}
          {!isParent && (
            <TextInput
              secureTextEntry={true}
              value={childCode}
              onChangeText={handleChangeText}
              keyboardType="numeric"
              placeholder="XXXX"
              placeholderTextColor="black"
              style={styles.codeInput}
              maxLength={4}
            />
          )}
          {isParent && (
            <Animated.View style={[styles.formButton, FormButtonAnimatedStyle]}>
              <Pressable
                onPress={() => {
                  formButtonScale.value = withSequence(
                    withSpring(1.1),
                    withSpring(1)
                  );
                  login(email, password);
                }}
              >
                <Text style={styles.buttonText}>PRIJAVI SE</Text>
              </Pressable>
            </Animated.View>
          )}

          {!isParent && (
            <Animated.View style={[styles.formButton, FormButtonAnimatedStyle]}>
              <Pressable
                onPress={() => {
                  formButtonScale.value = withSequence(
                    withSpring(1.1),
                    withSpring(1)
                  );
                  loginChild(childCode);
                }}
              >
                <Text style={styles.buttonText}>PRIJAVI SE</Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
