package com.dev.finance.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
@SequenceGenerator(name = "transaction_seq", sequenceName = "transaction_seq", initialValue = 1, allocationSize = 1)
public class Transaction {
    public enum Type {
        income,
        outcome
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_seq")
    private long id;
    private String description;
    private int value;
    private String created_at;

    public Transaction() {}

    public Transaction(long id, String description, int value, String created_at) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.created_at = created_at;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }
}
