import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class generate-admin-password {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Admin@123";
        String hashed = encoder.encode(password);
        System.out.println("Password hash for 'Admin@123':");
        System.out.println(hashed);
    }
}


