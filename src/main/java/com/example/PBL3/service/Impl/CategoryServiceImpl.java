package com.example.PBL3.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.CategoryDTO;
import com.example.PBL3.exception.UserNotFoundException;
import com.example.PBL3.model.Category;
import com.example.PBL3.repository.CategoryRepository;
import com.example.PBL3.service.CategoryService;
import com.example.PBL3.util.MapperUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
	private final CategoryRepository categoryRepo;
	private final MapperUtil mapperUtil;


	@Override
	public List<CategoryDTO> getAllCategories(){
		return categoryRepo.findAll().stream().map(mapperUtil::toCategoryDTO).collect(Collectors.toList());
	}

	@Override
	public CategoryDTO getCategoryById(Long id) {
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> new UserNotFoundException("Category not found with id: " + id));
		return mapperUtil.toCategoryDTO(category);
	}

	@Override
	public CategoryDTO createCategory(CategoryDTO dto) {

//		if (categoryRepo.existByName(dto.getName())) {
//			throw new DuplicateResourceException("Category already existed");
//		}

		Category category = mapperUtil.toCategory(dto);

		if (dto.getParentId() != null) {
			Category parent = categoryRepo.findById(dto.getParentId())
					.orElseThrow(() -> new RuntimeException("Parent not found"));
			category.setParent(parent);
		}
		Category saved =  categoryRepo.save(category);
		return mapperUtil.toCategoryDTO(saved);
	}

	@Override
	public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
		Category existing = categoryRepo.findById(id)
				.orElseThrow( () -> new RuntimeException("Category not found with id: " + id));

		existing.setName(categoryDTO.getName());

		if (categoryDTO.getParentId() != null) {
			Category parent = categoryRepo.findById(categoryDTO.getParentId())
					.orElseThrow(() -> new RuntimeException("Parent not found"));
			existing.setParent(parent);
		}
		else existing.setParent(null);

		Category updated = categoryRepo.save(existing);
		return mapperUtil.toCategoryDTO(updated);
	}

	@Override
	public void deleteCategory(Long id) {
		if (!categoryRepo.existsById(id)) {
			throw new RuntimeException("Category not found");
		}

		categoryRepo.deleteById(id);
	}
}
