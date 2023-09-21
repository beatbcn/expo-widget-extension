import { requireNativeModule } from 'expo-modules-core';
import type { ExpoWidgetExtension } from './types';

export default requireNativeModule("ExpoWidgetExtension") as ExpoWidgetExtension;

