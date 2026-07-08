package com.waypay.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public final class CurrencyUtil {

    private static final Locale INDIA = Locale.of("en", "IN");

    private CurrencyUtil() {
    }

    /**
     * Format amount to Indian Rupee format (e.g., ₹1,00,000.00)
     */
    public static String formatINR(BigDecimal amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(INDIA);
        return format.format(amount);
    }

    /**
     * Convert rupees to paise (for Stripe)
     */
    public static long toPaise(BigDecimal rupees) {
        return rupees.multiply(BigDecimal.valueOf(100)).longValue();
    }

    /**
     * Convert paise to rupees (from Stripe)
     */
    public static BigDecimal toRupees(long paise) {
        return BigDecimal.valueOf(paise).divide(BigDecimal.valueOf(100));
    }
}
