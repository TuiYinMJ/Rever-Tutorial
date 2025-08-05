# command = ["move", 100, 200]
command = ["draw", "circle", {"radius": 50}]
# command = ["quit"]

match command:
    case ["move", x, y]:
        print(f"移动到坐标 ({x}, {y})")

    case ["draw", shape, {"radius": r}]:
        print(f"绘制图形 {shape}，半径为 {r}")

    case ["draw", shape, *options]:  # *options 匹配任意多个额外项
        print(f"绘制图形 {shape}，选项为 {options}")

    case ["quit"]:
        print("正在退出...")

    case _:
        print("未知指令")
