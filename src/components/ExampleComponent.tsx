import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ExampleComponentProps {
  title: string;
  onPress: () => void;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Button title="Press Me" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ExampleComponent;