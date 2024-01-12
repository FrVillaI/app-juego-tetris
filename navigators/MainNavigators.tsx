import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import InicioSecionScreen from "../screens/InicioSecionScreen";
import RegistroScreen from "../screens/RegistroScreen";
import JuegoScreen from "../screens/JuegoScreen";
import ListaPuntuacionScreen from "../screens/ListaPuntuacionScreen";
import PerfilScreen from "../screens/PerfilScreen";



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyStack() {
    return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultar la barra superior en todas las pantallas
      }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Tabs" component={MyTabs} />
        <Stack.Screen name="Inciar_Secion" component={InicioSecionScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
      </Stack.Navigator>
    );
  }

  function MyTabs() {
    return (
      <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultar la barra superior en todas las pantallas
      }}
      >
        <Tab.Screen name="Juego" component={JuegoScreen} />
        <Tab.Screen name="Puntuacion" component={ListaPuntuacionScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    );
  }
 
  export default function TopTabNavigator(){
    return(
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    )
  }