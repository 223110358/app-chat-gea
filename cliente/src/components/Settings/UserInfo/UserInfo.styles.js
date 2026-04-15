import { StyleSheet } from "react-native";

export const createStyles = (colors) => StyleSheet.create({
  content: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 28,
    marginTop: 20,
  },
  avatar: {
    marginBottom: 18,
  },
  identify: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  email: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
});
