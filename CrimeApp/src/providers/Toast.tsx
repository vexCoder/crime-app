import React from "react";
import { toast as rhtoast } from "react-hot-toast/src/core/toast";
import { useToaster } from "react-hot-toast/src/core/use-toaster";
import { Toast } from "react-hot-toast/src/core/types";
import { Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewProps } from "react-native";
import { CheckCircleIcon,
  Text,
  WarningIcon } from "native-base";

interface IToastContextProps {
  children: React.ReactChild;
}

interface IToastContextValue {
  success: (message?: string) => void;
  error: (message?: string) => void;
}

const ToastContext = React.createContext<IToastContextValue>(
  {} as IToastContextValue,
);

const ToastProvider: React.FunctionComponent<IToastContextProps> = ({
  children,
}) => {
  const { toasts, handlers } = useToaster();

  const toast: IToastContextValue = {
    success: (message?: string) =>
      rhtoast(message || "Success", {
        icon: <CheckCircleIcon color="white" />,
        style: {
          backgroundColor: "#69f0ae",
          color: "white",
        },
      }),
    error: (message?: string) =>
      rhtoast(message || "Error", {
        icon: <WarningIcon color="white" />,
        style: {
          backgroundColor: "#ff5252",
          color: "white",
        },
      }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {toasts.map(t => (
        <Toaster
          key={t.id}
          t={t}
          updateHeight={handlers.updateHeight}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
      {children}
    </ToastContext.Provider>
  );
};

interface ToasterProps {
  t: Toast;
  updateHeight: (toastId: string, height: number) => void;
  offset: number;
}

const Toaster = ({ t, updateHeight, offset }: ToasterProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0.5)).current; // Initial value for opacity: 0
  const posAnim = React.useRef(new Animated.Value(-80)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [ fadeAnim, t.visible ]);

  React.useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
      useNativeDriver: true,
    }).start();
  }, [ posAnim, offset, t.visible ]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: "center",
        opacity: fadeAnim,
        transform: [
          {
            translateY: posAnim,
          },
        ],
      }}
    >
      <View
        onLayout={event => updateHeight(t.id, event.nativeEvent.layout.height)}
        style={{
          ...styles.container,
          ...(t.style as any),
        }}
        key={t.id}
      >
        {t.icon}
        <Text
          style={{
            color: "#fff",
            padding: 4,
            flex: 1,
            textAlign: "center",
          }}
        >
          {t.message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    margin: 40,
    paddingHorizontal: 8,
    paddingLeft: 16,
    paddingVertical: 8,
    width: "90%",
  },
});

const useToast = () => {
  const context: IToastContextValue = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("Context must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider,
  useToast };
