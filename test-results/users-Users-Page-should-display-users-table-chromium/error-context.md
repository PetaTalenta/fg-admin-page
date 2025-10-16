# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - heading "Admin Dashboard" [level=2] [ref=e7]
      - paragraph [ref=e8]: Sign in to access the FutureGuide admin panel
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: Email address
          - textbox "Email address" [ref=e13]:
            - /placeholder: admin@example.com
            - text: admin@futureguide.id
        - generic [ref=e14]:
          - generic [ref=e15]: Password
          - textbox "Password" [ref=e16]:
            - /placeholder: ••••••••
            - text: admin123
      - button "Sign in" [ref=e18] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```