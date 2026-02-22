import { Tabs } from "expo-router";
import React from "react";

function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="modules"
        options={{
          title: "Modules",
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;
