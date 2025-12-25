package com.example.PBL3.config;

import com.example.PBL3.model.Category;
import com.example.PBL3.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            log.info("Starting category initialization...");
            List<String> categories = Arrays.asList(
                    "T-Shirt", "Shoes", "Watches", "Bag", "Hat",
                    "Pants", "Hoodie", "Jacket", "Dress", "Skirt",
                    "Electronics", "Accessories", "Beauty", "Sports");

            int createdCount = 0;
            for (String catName : categories) {
                if (categoryRepository.findByName(catName).isEmpty()) {
                    Category category = new Category();
                    category.setName(catName);
                    categoryRepository.save(category);
                    createdCount++;
                    log.debug("Created category: {}", catName);
                }
            }
            log.info("Category initialization completed. Created {} new categories.", createdCount);
        };
    }
}
