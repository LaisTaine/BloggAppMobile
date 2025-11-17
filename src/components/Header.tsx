import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppStackParamList } from '../routes/app.routes'; // ../
import { AppDispatch, RootState } from '../store'; // ../
import { clearCredentials } from '../store/authSlice'; // ../


type HeaderNavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigation = useNavigation<HeaderNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();


  const user = useSelector((state: RootState) => state.auth.user);

  async function handleLogout() {
    Alert.alert(
      "Sair",
      "Você tem certeza que quer sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: async () => {
            dispatch(clearCredentials());
            await AsyncStorage.removeItem('@BlogApp:token');
            await AsyncStorage.removeItem('@BlogApp:user');
            navigation.navigate('Login'); 
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{title}</Text>


      <View style={styles.iconsContainer}>

        {user?.userType === 'professor' && (
          <>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Feather name="plus-square" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('ListTeachers')}
            >
              <Feather name="users" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('ListStudents')}
            >
              <Feather name="book-open" size={24} color="#333" />
            </TouchableOpacity>
          </>
        )}
        

        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 50, 
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16, 
  },
});