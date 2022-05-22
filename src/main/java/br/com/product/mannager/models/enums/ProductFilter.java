package br.com.product.mannager.models.enums;

public enum ProductFilter {

    NAME("name"), BRAND("brand"), PRICE("price");

    private String msg;
    ProductFilter(String msg){
        this.msg = msg;
    }

    public String getFilter(){
        return msg;
    }

}
