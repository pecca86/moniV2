package com.pekka.moni.account;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class TestBD {

    public static void main(String[] args) {
        BigDecimal bd = BigDecimal.valueOf(0.0);
        System.out.println(bd);

        bd = bd.add(BigDecimal.valueOf(101010.5555));
        bd = bd.setScale(2, RoundingMode.HALF_EVEN);

        System.out.println(bd);

        bd = bd.add(BigDecimal.valueOf(101010.5555));
        System.out.println(bd);
    }
}
