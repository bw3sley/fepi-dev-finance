package com.dev.finance.demo.model;

public class Usuario {
        public String publicId;

        private int id;
        private String name;
        private String email;

        public Usuario (String name, String email) {
            this.name = name;
            this.email = email;

            this.publicId = "9381888d-77c7-4aaa-86e4-aa9f830839db"; // eu ainda não sei gerar uuid por aqui
            this.id += 1;
        }

        public String getPublicId() {
            return publicId;
        }

        public void setPublicId(String publicId) {
            this.publicId = publicId;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name; 
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

