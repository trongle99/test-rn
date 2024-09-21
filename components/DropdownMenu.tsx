import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';

interface DropdownMenuProps {
  title: string | React.ReactNode;
  titleStyle?: TextStyle;
  triggerButtonStyle?: ViewStyle;
  showChevron?: boolean;
  position?: 'left' | 'right';
  children: React.ReactNode;
}

const DropdownContext = React.createContext<{closeMenu: () => void} | null>(
  null,
);

const DropdownMenu: React.FC<DropdownMenuProps> & {Item: typeof Item} = ({
  title,
  titleStyle,
  triggerButtonStyle,
  showChevron = true,
  position = 'left',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });
  const [menuDimensions, setMenuDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const triggerRef = useRef<View>(null);
  const menuRef = useRef<View>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleMenu = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150, // Fade out
      useNativeDriver: true,
    }).start(() => setIsVisible(false)); // Close the menu after fade-out completes
  }, [animatedValue]);

  const calculatePosition = useCallback(() => {
    if (
      triggerRef.current &&
      menuDimensions.width > 0 &&
      menuDimensions.height > 0
    ) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        const screenHeight = Dimensions.get('window').height - 25;
        const screenWidth = Dimensions.get('window').width;

        let menuX = x;
        let menuY = y + height;

        if (menuY + menuDimensions.height > screenHeight) {
          menuY = y - menuDimensions.height;
        }

        if (position === 'right') {
          menuX = x + width - menuDimensions.width;
        }

        if (menuX + menuDimensions.width > screenWidth) {
          menuX = screenWidth - menuDimensions.width;
        }

        if (menuX < 0) {
          menuX = 0;
        }

        setMenuPosition({x: menuX, y: menuY});
      });
    }
  }, [menuDimensions, position]);

  const handleMenuLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setMenuDimensions({width, height});
  }, []);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150, // Fade in
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, calculatePosition, animatedValue]);

  const opacity = animatedValue;

  return (
    <DropdownContext.Provider value={{closeMenu}}>
      <>
        <Pressable ref={triggerRef} onPress={toggleMenu}>
          <View style={[styles.triggerButton, triggerButtonStyle]}>
            <Text style={titleStyle}>{title}</Text>
            {showChevron && <Text>v</Text>}
          </View>
        </Pressable>

        {isVisible && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={[StyleSheet.absoluteFill, {zIndex: 9999}]}>
              <Animated.View
                ref={menuRef}
                onLayout={handleMenuLayout}
                style={[
                  styles.menu,
                  {
                    top: menuPosition.y,
                    left: menuPosition.x,
                    opacity, // Fade effect
                  },
                ]}>
                <TouchableWithoutFeedback>
                  <View>{children}</View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </>
    </DropdownContext.Provider>
  );
};

interface ItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  style?: ViewStyle;
}

const Item: React.FC<ItemProps> = ({children, onSelect, style}) => {
  const dropdownContext = React.useContext(DropdownContext);

  const handlePress = () => {
    onSelect();
    dropdownContext?.closeMenu();
  };

  return (
    <TouchableOpacity style={[styles.menuOption, style]} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
};

DropdownMenu.Item = Item;

const styles = StyleSheet.create({
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
    minWidth: 150,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default DropdownMenu;
