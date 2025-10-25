package com.example.PBL3.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

//    @GetMapping({"/", "/home"})
//    public String home(Model model) {
//        model.addAttribute("title", "Trang chủ - Demo Bootstrap + Thymeleaf");
//        model.addAttribute("message", "Chào mừng đến với trang /home!");
//        return "home"; // trả về templates/home.html
//    }
//
//    @GetMapping("/about")
//    public String about(Model model) {
//
//    		return "about";
//    }
	@GetMapping("/")
	public String index() {
		return "forward:/Views/index.html";
	}
}